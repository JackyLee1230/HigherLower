import { useState } from "react";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/homepage" element={<Homepage />} />
			</Routes>
		</Router>
	);
}

export default App;
