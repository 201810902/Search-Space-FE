import styles from './TimeSelector.module.css';

export default function TimeSelector() {
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );
  const minutes = Array.from({ length: 6 }, (_, i) =>
    (i * 10).toString().padStart(2, '0'),
  );
  return (
    <div>
      <span>오픈</span>
      <select className={styles.timeSelect}>
        {hours.map(hour => (
          <option key={`open-hour-${hour}`} value={hour}>
            {hour}시
          </option>
        ))}
      </select>
      <select className={styles.timeSelect}>
        {minutes.map(minute => (
          <option key={`open-min-${minute}`} value={minute}>
            {minute}분
          </option>
        ))}
      </select>
      <span>마감</span>
      <select className={styles.timeSelect}>
        {hours.map(hour => (
          <option key={`close-hour-${hour}`} value={hour}>
            {hour}시
          </option>
        ))}
      </select>
      <select className={styles.timeSelect}>
        {minutes.map(minute => (
          <option key={`close-min-${minute}`} value={minute}>
            {minute}분
          </option>
        ))}
      </select>
      <input type="checkbox" /> 24시간 운영
    </div>
  );
}
