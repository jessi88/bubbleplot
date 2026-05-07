import "./App.css";
import Bubbleplot from "./Bubbleplot";
import { data } from "./data";

const width = 1000;
const height = 600;
const highlightColor = "#0072B2";
const backgroundColor = "#B0B0B0";
const backgroundTextColor = "#7c7c7c";
const tickColor = "#242424";

function App() {
  return (
    <Bubbleplot
      data={data}
      width={width}
      height={height}
      highlightColor={highlightColor}
      backgroundColor={backgroundColor}
      backgroundTextColor={backgroundTextColor}
      tickColor={tickColor}
    />
  );
}

export default App;
