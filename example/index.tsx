import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import propsAreEqual from 'react-pae';

interface Props {
  date: Date;
  onClick: () => void;
  bookings: Array<{ startDate: Date; endDate: Date }>;
}

const Month = (props: Props) => {
  return (
    <div>
      {props.date.getMonth()}
      <button onClick={props.onClick}>open month</button>
    </div>
  );
};

export default React.memo(
  Month,
  propsAreEqual<Props>({
    date: (prev, next) => +prev === +next,
    onClick: 'skip',
    bookings: 'deep',
  })
);

ReactDOM.render(
  <Month bookings={[]} date={new Date()} onClick={() => alert('hey')} />,
  document.getElementById('root')
);
