import './App.css';

//Prepare Swaps
function prepareSwaps() {

  //Get Trade Data
  var myHeaders = new Headers();
  myHeaders.append("X-API-KEY", "BQYs9KbLZIw9YDmWFPLx42fBWjZFtanL");
  myHeaders.append("Content-Type", "application/json");

  var graphql = JSON.stringify({
    query: "query ($network: EthereumNetwork!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\r\n  ethereum(network: $network) {\r\n    dexTrades(\r\n      options: {desc: \"count\", limit: $limit, offset: $offset}\r\n      date: {since: $from, till: $till}\r\n    ) {\r\n      sellCurrency {\r\n        symbol\r\n        address\r\n      }\r\n      sellAmount\r\n      buyCurrency {\r\n        symbol\r\n        address\r\n      }\r\n      buyAmount\r\n      count\r\n      median_price: price(calculate: median)\r\n      last_price: maximum(of: block, get: price)\r\n      dates: count(uniq: dates)\r\n      started: minimum(of: date)\r\n    }\r\n  }\r\n}\r\n",
    variables: {"limit":10,"offset":0,"network":"matic","from":"2022-06-16T06:32:08.502Z","till":"2022-06-14T23:59:59","dateFormat":"%Y-%m-%d"}
  })
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: graphql,
    redirect: 'follow'
  };

  fetch("https://graphql.bitquery.io", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

  tradeData = JSON.parse(response);

  trades = tradeData.data.data.ethereum.dexTrades;

  //Parse Trade Data
  foreach( i=0, trades as trade, i++ ) {

    //Append Volatility
    volatilityScore = trade.lastPrice - trade.medianPrice;

    //Parse Tokens into Array
    Tokens.push({
      "name" : trade.buyCurrency.name,
      "symbol" : trade.buyCurrency.symbol,
      "address" : trade.buyCurrency.address,
      "tradeCount" : trade.count,
      "volatilityScore" : volatilityScore,
      "currentTimestamp" : date(),
      "previousTimestamp" : trades.started
    });

    //Display Tokens Into Swaps Column
    $(.swaps_column).prepend( addSwapCard( Tokens[i] ) );

  }
}

//Get Quotes From Exchanges
function getQuotes(_currencyAddress) {

  //Get Trade Data
  var myHeaders = new Headers();
  myHeaders.append("X-API-KEY", "BQYs9KbLZIw9YDmWFPLx42fBWjZFtanL");
  myHeaders.append("Content-Type", "application/json");

  var graphql = JSON.stringify({
    query: "query ($network: EthereumNetwork!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\r\n  ethereum(network: $network) {\r\n    dexTrades(\r\n      options: {desc: \"count\", limit: $limit, offset: $offset}\r\n      date: {since: $from, till: $till}\r\n    ) {\r\n      sellCurrency {\r\n        symbol\r\n        address\r\n      }\r\n      sellAmount\r\n      buyCurrency {\r\n        symbol\r\n        address\r\n      }\r\n      buyAmount\r\n      count\r\n      median_price: price(calculate: median)\r\n      last_price: maximum(of: block, get: price)\r\n      dates: count(uniq: dates)\r\n      started: minimum(of: date)\r\n    }\r\n  }\r\n}\r\n",
    variables: {"limit":10,"offset":0,"network":"matic","from":"2022-06-16T06:32:08.502Z","till":"2022-06-14T23:59:59","dateFormat":"%Y-%m-%d"}
  })
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: graphql,
    redirect: 'follow'
  };

  fetch("https://graphql.bitquery.io", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

  quoteData = JSON.parse(response);

  quotes = tradeData.data.data.ethereum.dexTrades;

  quotesList = array[];

  //Parse Trade Data
  foreach( i=0, quotes as quote, i++ ) {

    //Append Volatility
    volatilityScore = trade.lastPrice - trade.medianPrice;

    //Parse Tokens into Array
    quotesList.push({
      "name" : trade.buyCurrency.name,
      "symbol" : trade.buyCurrency.symbol,
      "address" : trade.buyCurrency.address,
      "tradeCount" : trade.count,
      "volatilityScore" : volatilityScore,
      "currentTimestamp" : date(),
      "previousTimestamp" : trades.started
    });

  }

  return quotesList;
}

//Create Swap Card Function
function addSwapCard( _Token ) {
  //swap_card HTML
  return(
    <div className="swap_card" address='${_Token.addres}'>
      <div className="token_img">
        <img src='$logo' alt='$tokenName' />
      </div>
      <div className='details_left'>
        <div className='symbol'>
          ${_Token.symbol}
        </div>
        <div className='label'>
          T${_Token.tradeCount}
        </div>
      </div>
      <div className='details_right'>
        <div className='score'>
          ${_Token.volatilityScore}
        </div>
        <div className='label'>
          VOLATILITY
        </div>
      </div>
    </div>
  ); 
}

//Create Buy Card Function
function addBuyCard( _buyQuote ) {
  //swap_card HTML
  return(
    <div className="swap_card">
      <div className="token_img">
        <img src='$logo' alt='$tokenName' />
      </div>
      <div className='details_left'>
        <div className='symbol'>
          ${_Token.symbol}
        </div>
        <div className='label'>
          T${_Token.tradeCount}
        </div>
      </div>
      <div className='details_right'>
        <div className='score'>
          ${_Token.volatilityScore}
        </div>
        <div className='label'>
          VOLATILITY
        </div>
      </div>
    </div>
  ); 
}

//Create Sell Card Function
function addSellCard( _sellQuote ) {
  //swap_card HTML
  return(
    <div className="swap_card">
      <div className="token_img">
        <img src='$logo' alt='$tokenName' />
      </div>
      <div className='details_left'>
        <div className='symbol'>
          ${_Token.symbol}
        </div>
        <div className='label'>
          T${_Token.tradeCount}
        </div>
      </div>
      <div className='details_right'>
        <div className='score'>
          ${_Token.volatilityScore}
        </div>
        <div className='label'>
          VOLATILITY
        </div>
      </div>
    </div>
  ); 
}

//Text Run Exchange Prices
function getExchangePrice(_swapCurrency, _quoteCurrency, _exchangeRouter, _exchangeProtocol) {
  
  //Connect to Web3 Provider

  //Send Price Request

  //Return Genuine Price

};

//Test Run Exchange Fees
function getExchangeFee(_swapCurrency, _quoteCurrency, _exchangeRouter, _exchangeProtocol) {
  
  //Connect to Web3 Provider

  //Send Price Request

  //Return Genuine Price

};

//Test Run Estimated Gas
function getEstimatedGas(_swapCurrency, _quoteCurrency, _exchangeRouter, _exchangeProtocol) {
  
  //Connect to Web3 Provider

  //Send Price Request

  //Return Genuine Price

};

//Start On Page Load
prepareSwaps();

//After Swap Token Chosen
$(.swap_card).click(function(this){

  //Set Swap Token in trade_column
  $(.trade_column .swap_card).replace(this);

  //Get Quotes From Exchanges
  swapCurrency = this.attr("address");

  quotes = getQuotes(swapCurrency);

  sortedQuotes = quotes.sort("quotePrice","ASC");

  //Display Quotes into buy_column and sell_column
  foreach( sortedQuotes as theQuote ) {
    $('.buy_column').prepend(addBuyCard(theQuote));
    $('.sell_column').append(addSellCard(theQuote));
  }
})

//Start Listening For Swaps to Update Prices

//After Buy Quote Chosen
$('.buy_card').click(function(){

  //Set Buy Card in trade_column
  $(.trade_column .buy_card).replace(this);

  //Set Buy Exchange Router
  buyExchangeRouter = this.attr("router");

  //Set Buy Exchange Protocol
  buyExchangeRouter = this.attr("protocol");

});

//After Sell Quote Chosen
$('.buy_card').click(function(){
  
  //Set Sell Card in trade_column
  $(.trade_column .sell_card).replace(this);

  //Set Sell Exchange Router
  sellExchangeRouter = this.attr("router");

  //Set Sell Exchange Protocol
  sellExchangeRouter = this.attr("protocol");

});

//After Test Button
$('.test_button').click(function(){
  //Get Price Quote from Routers
  getExchangePrice();
  
  //Get Estimated Fees
  getExchangeFee();

  //Get Estimated Gas
  getEstimatedGas();

  //Get Estimated Slippage
  getEstimatedSlippage();

  //Update Prices

  //Toggle Buttons
  $('.test_button').hide();
  $('.send_button').show();

});

//After Send Transaction
$('.send_button').click(function(){

  //Connect to SwapYard Contract

  //Send Transaction

  //Return Reciept

  //Display Results

  //Log Results

  //Refresh Page

};

function App() {
  return (
    <div className="main">

      <div className="header">
        <div className="logo">
          <img src='$logo' alt='SwapYard' />
        </div>
      </div>
      
      <div className="swaps_column">
        <div className="swaps_heading">
          SWAP
        </div>

        <div className="swap_card">
          <div className="token_img">
            <img src='$logo' alt='$tokenName' />
          </div>
          <div className='details_left'>
            <div className='symbol'>
              "SYMBOL"
            </div>
            <div className='label'>
              "T" 987696
            </div>
          </div>
          <div className='details_right'>
            <div className='score'>
              + 3434
            </div>
            <div className='label'>
              VOLATILITY
            </div>
          </div>
        </div>  

      </div>

      <div className='buys_column'>
        <div className='buys_heading'>
          BUY
        </div>

        <div className="buy_card">
          <div className="token_img">
            <img src='$logo' alt='$tokenName' />
          </div>
          <div className='details_left'>
            <div className='symbol'>
              "SYMBOL"
            </div>
            <div className='label'>
              "T" 987696
            </div>
          </div>
          <div className='details_right'>
            <div className='price'>
              + 3434
            </div>
            <div className='label'>
              UNISWAP
            </div>
          </div>
        </div>
        
      </div>

      <div className='sells_column'>
        <div className='sells_heading'>
          SELL
        </div>

        <div className="sell_card">
          <div className="token_img">
            <img src='$logo' alt='$tokenName' />
          </div>
          <div className='details_left'>
            <div className='symbol'>
              "SYMBOL"
            </div>
            <div className='label'>
              "T" 987696
            </div>
          </div>
          <div className='details_right'>
            <div className='score'>
              + 3434
            </div>
            <div className='label'>
              VOLATILITY
            </div>
          </div>
        </div>

      </div>

      <div className='trade_column'>
        <div className='borrow_heading'>
            BORROW
        </div>
        <div className='borrow_select'>
            <div className='borrow_less'>
                <img src='' alt=''></img>
            </div>
            <div className='borrow_amount'>
                $987
            </div>
            <div className='borrow_more'>
                <img src='' alt=''></img>
            </div>
        </div>
        <div className="swap_card">
        <div className="token_img">
            <img src='$logo' alt='$tokenName' />
        </div>
        <div className='details_left'>
            <div className='symbol'>
            "SYMBOL"
            </div>
            <div className='label'>
            "T" 987696
            </div>
        </div>
        <div className='details_right'>
            <div className='score'>
            + 3434
            </div>
            <div className='label'>
            VOLATILITY
            </div>
        </div>
        </div>
        <div className="buy_card">
        <div className="token_img">
            <img src='$logo' alt='$tokenName' />
        </div>
        <div className='details_left'>
            <div className='symbol'>
            "SYMBOL"
            </div>
            <div className='label'>
            "T" 987696
            </div>
        </div>
        <div className='details_right'>
            <div className='score'>
            + 3434
            </div>
            <div className='label'>
            VOLATILITY
            </div>
        </div>
        </div>
        <div className='swap_image'>
            <img src='' alt=''></img>
        </div>
        <div className="sell_card">
        <div className="token_img">
            <img src='$logo' alt='$tokenName' />
        </div>
        <div className='details_left'>
            <div className='symbol'>
            "SYMBOL"
            </div>
            <div className='label'>
            "T" 987696
            </div>
        </div>
        <div className='details_right'>
            <div className='score'>
            + 3434
            </div>
            <div className='label'>
            VOLATILITY
            </div>
        </div>
        </div>
        <div className='trade_details profit'>
            <div className='label_left'>

            </div>
            <div className='label_right'>

            </div>
        </div>
        <div className='trade_details fees'>
            <div className='label_left'>

            </div>
            <div className='label_right'>
                
            </div>
        </div>
        <div className='trade_details return'>
            <div className='label_left'>

            </div>
            <div className='label_right'>
                
            </div>
        </div>
        <div className='trade_details gas'>
            <div className='label_left'>

            </div>
            <div className='label_right'>
                
            </div>
        </div>
        <div className='trade_details slippage'>
            <div className='label_left'>

            </div>
            <div className='label_right'>
                
            </div>
        </div>
        
        <div className='test_button'>
            TEST
        </div>

        <div className='confirmation_button'>
            SEND
        </div>
      </div>

    </div>
  );
}

export default App;
