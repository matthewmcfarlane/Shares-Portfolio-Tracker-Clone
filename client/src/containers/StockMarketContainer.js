import React, {useState, useEffect} from 'react';
import StockMarketList from '../components/stockMarketComponents/StockMarketList';
import StockMarketSearch from '../components/stockMarketComponents/StockMarketSearch';
import StockItemDetails from '../components/stockMarketComponents/StockItemDetails';
import FavouriteStock from '../components/stockMarketComponents/FavouriteStock';
import {Row, Col} from "react-bootstrap";
import './StockMarketContainer.css'
import { apikey } from '../services/apikey';
import {fetchedStockDetails, fetchedStockPrices} from '../components/stockMarketComponents/fetchedData';


const StockMarketContainer = ({stocks, handleHistPrices, historicalPrices}) => {

    const [searchedStockSymbol, setSearchedStockSymbol] = useState(null);
    const [stockFavourites, setStockFavourites] = useState([]);

    // const [stockDetails, setStockDetails] = useState(fetchedStockDetails);
    // const [stockPrices, setStockPrices] = useState(fetchedStockPrices);

    const [stockDetails, setStockDetails] = useState(null);
    const [stockPrices, setStockPrices] = useState(null);

    useEffect(() => {
        if (searchedStockSymbol){
        const url1 = `https://financialmodelingprep.com/api/v3/profile/${searchedStockSymbol}?apikey=${apikey}`
        fetch(url1)
        .then(data => data.json())
        // data[0] - is an object
        .then(data => setStockDetails(data[0]))

        const url2 = `https://financialmodelingprep.com/api/v3/historical-price-full/${searchedStockSymbol}?timeseries=65&apikey=${apikey}`
        fetch(url2)
        .then(data => data.json())
        .then(data => {
            setStockPrices(data.historical)
            // data.historical - an array of 2 objects
            historicStockPrice(data.historical)
        })}
        // historicStockPrice(stockPrices)
    },[searchedStockSymbol]);


    const historicStockPrice = (stockClosePrices) => {
        const hist30dayPrices = []
        if (stockClosePrices.length > 0){
            const result = stockClosePrices.map((stockPrice) => {
            hist30dayPrices.push(stockPrice.close)
        })};
        console.log("historicStockPrice", historicStockPrice);
        handleHistPrices({
            symbol: searchedStockSymbol,
            prices: hist30dayPrices
        });
    };

    const handleSearchedStock = (stockName) => {
        console.log("stockName", stockName);
        // Change the state with event.target.value after enter
        setSearchedStockSymbol(stockName)
    };

    const addToFavourites = (favourite) => {
        setStockFavourites([favourite, ...stockFavourites]);
    };

    const displayFavourites = stockFavourites.map((favourite, index) => {
        return <FavouriteStock favourite={favourite} key={index} stockPrices={stockPrices}/>})

    return (
        <>
            <div className='stockmarket-container'>
                <Row>
                    <Col>
                        <StockMarketSearch stocks={stocks} handleSearchedStock={handleSearchedStock}/>
                    </Col>
                </Row>
                <Row>
                    {searchedStockSymbol && stockDetails && stockPrices ? <Col><StockItemDetails symbol={searchedStockSymbol} handleHistPrices={handleHistPrices} historicalPrices={historicalPrices} addToFavourites={addToFavourites} stockPrices={stockPrices} stockDetails={stockDetails}/></Col> : null}
                </Row>

                {displayFavourites}

                <Row>
                    <Col>
                        <StockMarketList stocks={stocks}/>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default StockMarketContainer;
