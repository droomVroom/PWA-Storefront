import React, { useState } from 'react';
import { FaRegCommentDots, FaMoon, FaSun } from 'react-icons/fa';

const faqs = [
  {
    q: "How do I place an order?",
    a: "Add products to your cart and click 'Checkout'. Fill in any required info, then click 'Place Order'."
  },
  {
    q: "Can I shop offline?",
    a: "Yes! SnapCart supports offline browsing and cart via PWA features."
  },
  {
    q: "What payment options do you accept?",
    a: "Currently we support Cash on Delivery. Online payments will be added soon."
  },
  {
    q: "How can I contact customer support?",
    a: "Click the chat bubble and type your query. Our AI assistant will respond right away!"
  }
];

export default function ChatBot({darkMode, setDarkMode}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {from: 'bot', text:"Welcome to SnapCart AI! Ask a question or select a FAQ below."}
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (msg) => {
    if (!msg.trim()) return;
    setMessages(m => [...m, {from: 'user', text: msg}]);
    const match = faqs.find(f=>f.q.toLowerCase().includes(msg.toLowerCase()));
    if (match)
      setMessages(m => [...m, {from: 'bot', text: match.a}]);
    else
      setMessages(m => [...m, {from: 'bot', text: "Thanks for your query! Our team will respond soon."}]);
    setInput('');
  };

  return (
    <>
      <div style={{
  position:"fixed", zIndex:999, bottom:32, right:32,
  background: darkMode ? "#0ea5e9" : "#38bdf8",
  color: "#fff", width:64, height:64, borderRadius:"50%",
  boxShadow:"0 4px 16px #0002", cursor:"pointer",
  display:"flex", alignItems:"center", justifyContent:"center",
  fontSize:36
}} onClick={()=>setOpen(true)}>
  <FaRegCommentDots />
</div>
      {open &&
        <div style={{
          position:"fixed", bottom:110, right:32, zIndex:999,
          width:340, maxHeight:410, background: darkMode ? "#1e293b" : "#f5fafd",
          color: darkMode ? "#fff" : "#222",
          borderRadius:"18px", boxShadow:"0 8px 32px #0284c799",
          display:"flex", flexDirection:"column"
        }}>
          <div style={{
            padding:"14px 22px 7px 22px", fontWeight:"bold",
            fontSize:"1.05rem", background: darkMode ? "#0ea5e9" : "#bae6fd",
            borderTopLeftRadius:18, borderTopRightRadius:18,
            display:"flex", justifyContent:"space-between"
          }}>
            SnapCart Chatbot
            <span onClick={()=>setOpen(false)} style={{cursor:"pointer", fontWeight:"normal", fontSize:22}}>&times;</span>
          </div>
          <div style={{
            flex:1, overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column", gap:12
          }}>
            {messages.map((msg,i)=>(
              <div key={i} style={{
                alignSelf: msg.from==='user'?'flex-end':'flex-start',
                background: msg.from==='user' ? (darkMode ? "#334155" : "#e0f2fe") : (darkMode ? "#0284c7" : "#bae6fd"),
                color: msg.from==='user' ? "#fff" : "#222",
                padding:"10px 14px", borderRadius:"1rem",
                boxShadow:"0 2px 8px #0001", marginBottom:2, maxWidth:"80%"
              }}>
                {msg.text}
              </div>
            ))}
          </div>
          <div style={{padding:"9px 18px", borderTop:"1px solid #eee", display:"flex", gap:8}}>
            <input
              style={{
                flex:1, padding:"9px 12px", borderRadius:8,
                border:"1px solid #ddd", fontSize:16,
                background: darkMode?"#334155":"#fff",
                color: darkMode?"#fff":"#222"
              }}
              placeholder="Type your question..."
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"?sendMessage(input):null}
            />
            <button
              onClick={()=>sendMessage(input)} style={{
                background:darkMode?"#0ea5e9":"#0ea5e9", color:"#fff",
                border:"none", borderRadius:8, padding:"0 16px",
                fontWeight:"bold", fontSize:16, cursor:"pointer"
              }}>Send</button>
            <button
              style={{
                background:darkMode?"#fcd34d":"#fbbf24", border:"none",
                borderRadius:8, color:"#222", cursor:"pointer", padding:"0 7px"
              }}
              title="Toggle dark mode"
              onClick={()=>setDarkMode(x=>!x)}>
                {darkMode ? <FaSun/> : <FaMoon/>}
            </button>
          </div>
          <div style={{padding:"9px 18px", borderTop:"1px solid #eee", background: darkMode ? "#0ea5e9" : "#e0f2fe"}}>
            <div style={{fontWeight:"bold", marginBottom:5, fontSize:"1rem"}}>FAQs</div>
            <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
              {faqs.map((faq,i)=>(
                <button key={i} style={{
                  background:darkMode?"#334155":"#fff",
                  color:darkMode?"#fbbf24":"#0284c7",
                  padding:"7px 12px", margin:"2px 0", borderRadius:7,
                  border:"1px solid #bae6fd", fontWeight:"bold",
                  cursor:"pointer", fontSize:"0.97rem"
                }}
                onClick={()=>sendMessage(faq.q)}>
                  {faq.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    </>
  );
}
