"use client";
import React from "react";

const socials = [
  {
    name: "TikTok (Global)",
    url: "https://www.tiktok.com/@cardicnexus?_t=ZT-8zDvH2iUl01&_r=1",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/cardicnexus?igsh=MXh3NGhxZXdpdDR0OQ==",
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/CARDICNEXUS?t=xpUNONAmekVrQBRXiQp36A&s=09",
  },
];

const payments = [
  {
    label: "USDT ERC20",
    address: "0x713598879a14D07013d3154b225D2fa838bb0a54",
  },
  {
    label: "BTC",
    address: "bc1qm034jk98v7yzdy5yedyvwave96ujqjgnqyytm3",
  },
];

const prices = [
  { name: "Cardic Heat 2.0", note: "$25 / 2 months" },
  { name: "Cardic Heat 2.1", note: "$35 / 2 months" },
  {
    name: "Cardic Heat 2.3",
    note: "Early access $50 / 1 month (not officially released)",
  },
];

export default function CardicNexusLanding() {
  const copy = (text: string) => navigator.clipboard?.writeText(text);
  return (
    <main style={{ padding: 20, color: "white", background: "black" }}>
      <section>
      <h1 style={{ fontSize: "2rem", color: "#60a5fa" }}>Cardic Nexus</h1>
      <p>AI • Trading • Innovation</p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Socials</h2>
        <ul>
          {socials.map((s) => (
            <li key={s.name}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Payment Addresses</h2>
        <ul>
          {payments.map((p) => (
            <li key={p.label} style={{ marginBottom: 8 }}>
              <span>{p.label}: {p.address} </span>
              <button onClick={() => copy(p.address)}>Copy</button>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Pricing</h2>
        <ul>
          {prices.map((p) => (
            <li key={p.name}>
              {p.name} — {p.note}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
