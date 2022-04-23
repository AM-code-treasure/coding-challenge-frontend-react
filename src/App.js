import { useCallback, useEffect, useState } from 'react';
import { loadData } from './helpers/spreadsheet';
import './styles/App.css';
import {
  NavBar,
  RefreshCounter,
  Total,
  ProgressBar,
  LeftTable,
  RightTable,
} from './components';
import Background from './components/Background';
import { getOrdersMonth } from './helpers/filterFunc';
import { createOrdersInterval } from './helpers/timeRange';

function App() {
  const [orders, setOrders] = useState([]);
  const [targets, setTargets] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2000, 0, 1));
  const [intervalArray, setIntervalArray] = useState([new Date(2000, 0, 1)]);
  const [sumOrders, setSumOrders] = useState(0);

  const fetchData = async () => {
    await loadData((result, error) => {
      if (result) {
        setOrders(result[0]);
        setTargets(result[1]);
      } else {
        console.error(error);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      setIntervalArray(createOrdersInterval(orders));
      // console.log('january', getOrdersMonth(orders, 1));
      // console.log('orders', orders);
      // console.log('targets', targets);
      console.log('interval', intervalArray);
      currentMonth < intervalArray[0] ||
      currentMonth > intervalArray[intervalArray.length - 1]
        ? setCurrentMonth(intervalArray[0])
        : setCurrentMonth(currentMonth);
      // console.log(currentMonth);
      setSumOrders(
        getOrdersMonth(
          orders,
          currentMonth.getMonth() + 1,
          currentMonth.getFullYear(),
        ),
      );
    }
  }, [orders]);

  const refresh = useCallback(() => {
    console.log('refresh');
    fetchData();
  }, []);

  let progress = 0.52;
  let maxTarget = 120000;
  let currentTarget = 100000;

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      console.log('prev');
    } else if (direction === 'next') {
      console.log('next');
    }
  };

  return (
    <>
      <Background />
      <div className="App">
        <NavBar
          currentMonth={currentMonth}
          callback={(direction) => changeMonth(direction)}
          intervalArray={intervalArray}
        />
        <RefreshCounter callback={refresh} />
        <Total sum={sumOrders} />
        <ProgressBar
          progress={progress}
          maxTarget={maxTarget}
          currentTarget={currentTarget}
        />
        <div className="tables-container">
          <LeftTable />
          <RightTable />
        </div>
      </div>
    </>
  );
}

export default App;
