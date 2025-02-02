import React, { useState } from "react";
import styles from "./styles/GetHistory.module.scss";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { coinbaseLoading } from "@/assets";
import { HistoryResponseItem } from "./types";
import { networks } from "./constants";

export default function GetHistory(): React.JSX.Element {
  const defaultLimitValue = 10;


  const [limit, setLimit] = useState(defaultLimitValue);
  const [wAddress, setWAddress] = useState('');
  const [network, setNetwork] = useState(networks[0]);

  const { mutate: fetchHistory, isPending, data } = useMutation({
    mutationKey: ['walletHistory'],
    mutationFn: async () =>
      await axios.post(import.meta.env.VITE_APP_BACKEND_URL + '/wallet-history/', {
        limit,
        walletAddress: wAddress,
        network,
      }).then((res) => res.data),
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as string) || 'An error happened while fetching';
      toast.error(errorMessage)
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      fetchHistory();
    } catch (err) {
        toast.error("Something went wrong!")
        console.log('err', err);
    }
  };

  const handleCancel = () => {
    console.log('handle cancel');
  };

  const handleWalletAddressChange = (e: React.FormEvent<HTMLInputElement>) => {
    setWAddress((e.target as HTMLInputElement).value);
  };

  const onNetworkChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setNetwork((e.target as HTMLSelectElement).value);
};

  const handleLimitChange = (e: React.FormEvent<HTMLInputElement>) => {
    const maxLimitValue = 9999;
    const value = Number((e.target as HTMLInputElement).value);
    if (value <= maxLimitValue) {
        setLimit(value);
    }
  };

  const reduceStr = (addr: string) => {
    return `${addr?.slice(0, 7)}...${addr?.slice(-7)}`
  };

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!")
    } catch (err) {
      console.log('err:', err);
      toast.error("Failed to copy!")
    }
  };

  const renderTable = () => {
    if (!data) {
      return null;
    }
    return data.length ? (
      <div className={styles.tableContainer}>
        <div className={styles.tableCount}>
          Found {data?.length} transactions.
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Transaction Hash</th>
              <th>From</th>
              <th>To</th>
              <th>Network</th>
              <th>Amount</th>
              <th>Transfer Type</th>
              <th>Block Hash</th>
              <th>Block Height</th>
              <th>Block Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: HistoryResponseItem, i: number) => {
              const amount = Number(item.model.content.token_transfers[0].value) / 1000000;
              const transferType = item.model.content.token_transfers[0].token_transfer_type;
              return (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td className={styles.clickable}>
                      <a target="_blank" href={item.model.transaction_link}>
                        {reduceStr(item.model.transaction_hash)}
                      </a>
                  </td>
                  <td 
                    className={styles.clickable} 
                    onClick={() => copyToClipboard(item.model.from_address_id)}
                  >
                    {reduceStr(item.model.from_address_id)}
                  </td>
                  <td
                    className={styles.clickable} 
                    onClick={() => copyToClipboard(item.model.to_address_id)}
                  >
                    {reduceStr(item.model.to_address_id)}
                  </td>
                  <td>{item.model.network_id}</td>
                  <td>{amount}</td>
                  <td>{transferType}</td>
                  <td
                    className={styles.clickable} 
                    onClick={() => copyToClipboard(item.model.block_hash)}
                  >
                    {reduceStr(item.model.block_hash)}
                  </td>
                  <td>{item.model.block_height}</td>
                  <td>{item.model.content.block_timestamp}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : 'No data found.';
  };

  return (
    <div className={styles.main}>
      <h1>Wallet History Tool</h1>
      <div className={styles.header}>
        <form className={styles.formRows} onSubmit={handleSubmit} onReset={handleCancel}>
          <div className={styles.line}>
            <input 
              className={styles.input__address}
              type="text"
              name="wallet"
              placeholder="Enter wallet address. E.g: 0xsOmEAdDrEsS"
              value={wAddress}
              required
              onChange={handleWalletAddressChange}
            />
            <select value={network} className={styles.networkSelect} name="networks" onChange={onNetworkChange}>
              {networks.map((item, i) => {
                return (
                  <option key={i} value={item}>{item}</option>
                );
              })}
            </select>
          </div>
          <div className={styles.line}>
          </div>
          <div className={styles.line}>
            Get the last
            <input
              className={styles.input__limit} 
              type="number"
              name="amount"
              placeholder=""
              value={limit}
              required
              onChange={handleLimitChange}
            />
            transactions
            <button className={styles.btn__submit}>Submit</button>
          </div>
        </form>
      </div>
      {isPending ? (
        <img src={coinbaseLoading} className={styles.loading} alt="Loading" />
      ) : renderTable()}
    </div>
  );
};