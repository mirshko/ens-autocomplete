import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import Head from "next/head";
import { useEffect, useState } from "react";
import GitHubCorner from "../components/github-corner";

const cache = {};

async function fetchNames(value) {
  if (cache[value]) {
    return Promise.resolve(cache[value]);
  }

  const res = await fetch("/api/lookup?name=" + value);

  const result = await res.json();

  cache[value] = result;

  return result;
}

function useENSSearch(searchTerm) {
  const [names, setNames] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      let isFresh = true;

      fetchNames(searchTerm).then((names) => {
        if (isFresh) setNames(names);
      });

      return () => (isFresh = false);
    }
  }, [searchTerm]);

  return names;
}

export default function () {
  const [searchTerm, setSearchTerm] = useState("");

  const ensNames = useENSSearch(searchTerm);

  const handleSearchTermChange = (event) => setSearchTerm(event.target.value);

  return (
    <div className="container">
      <Head>
        <title>ENS Autocomplete</title>
        <meta
          name="description"
          content="Twitter like username autocomplete for ENS, Ethereum Name Service"
        />
        <meta name="author" content="@mirshko" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GitHubCorner />

      <div className="search">
        <div>
          <h1>ENS Autocomplete</h1>

          <Combobox>
            <ComboboxInput
              className="search-input"
              onChange={handleSearchTermChange}
              aria-label="ENS Names"
              placeholder="vitalik.eth"
            />
            {ensNames && (
              <ComboboxPopover className="shadow-popup">
                {ensNames.length > 0 ? (
                  <ComboboxList>
                    {ensNames.map(({ name }) => (
                      <ComboboxOption key={name} value={name} />
                    ))}
                  </ComboboxList>
                ) : (
                  <span className="empty">No results found</span>
                )}
              </ComboboxPopover>
            )}
          </Combobox>
        </div>
      </div>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        body {
          background-color: rgb(0, 0, 0);
          color: #f5f5f7;
        }

        h1 {
          text-align: center;
          font-size: 24px;
          margin-bottom: 40px;
        }

        .search {
          display: grid;
          place-items: center;
          min-height: 70vh;
        }

        .search-input {
          height: 48px;
          min-width: 200px;
          border-radius: 10px;
          background: rgb(0, 0, 0);
          border: 3px solid #f5f5f7;
          padding: 4px 16px;
          color: #f5f5f7;
          line-height: 40px;
          font-size: 16px;
          outline: none;
        }
        .search-input:focus,
        .search-input:active {
          border-color: hsl(240 11% 70% / 1);
        }

        * {
          box-sizing: border-box;
        }

        :root {
          --reach-combobox: 1;
        }

        .empty {
          display: block;
          padding: 4px 16px;
        }

        [data-reach-combobox-popover] {
          background: rgb(0, 0, 0);
          border: 3px solid #f5f5f7;
          margin-top: 16px;
          padding: 8px 0;
          border-radius: 10px;
        }

        [data-reach-combobox-list] {
          list-style: none;
          margin: 0;
          padding: 0;
          user-select: none;
        }

        [data-reach-combobox-option] {
          cursor: pointer;
          margin: 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;

          padding: 4px 16px;
        }

        [data-reach-combobox-option]:hover,
        [data-reach-combobox-option][aria-selected="true"],
        [data-reach-combobox-option][aria-selected="true"]:hover {
          background: #f5f5f7;
          color: rgb(0, 0, 0);
        }

        [data-suggested-value] {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
