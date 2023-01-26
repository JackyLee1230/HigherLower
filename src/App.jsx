import { useState } from "react";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/homepage" element={<Homepage />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
