import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db, firestore } from "../firebase.jsx";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import $ from "jquery";
import moment from "moment";
import Iframe from "react-iframe";
import { useCookies } from "react-cookie";
import {
	TextField,
	Button,
	Snackbar,
	Alert,
	InputAdornment,
	IconButton,
	FormControl,
	InputLabel,
	FilledInput,
	Fab,
	Modal,
	Select,
	MenuItem,
	Chip,
	useTheme,
} from "@mui/material";
import {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	deleteDoc,
	updateDoc,
	doc,
	setDoc,
	limit,
} from "firebase/firestore";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "./Navbar";
import CalendarMonthIcon from "@mui/icons-material/DateRange";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Typography from "@mui/material/Typography";

export default function Homepage(props) {
	const [data, setData] = useState("");
	const [score, setScore] = useState(0);
	const [lastScore, setLastScore] = useState(0);
	const [uuid, setUuid] = useState("");
	const [time, setTime] = useState("");
	const [highScore, setHighScore] = useState(0);
	const [token, setToken] = useState();
	const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
	const [showUpload, setShowUpload] = useState(true);

	const [results, setResults] = useState([]);

	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [left, setLeft] = useState([]);
	const [right, setRight] = useState([]);

	const [openLost, setOpenLost] = useState(false);

	const [openType, setOpenType] = useState(false);
	const handleOpenType = () => setOpenType(true);
	const handleCloseType = () => setOpenType(false);

	useEffect(() => {
		document.title = "Higher Or Lower By Jacky Lee";
		onAuthStateChanged(auth, (user) => {
			if (user) {
				const highScoreRef = ref(db, `/${user.uid}/highScore`);
				onValue(highScoreRef, (snapshot) => {
					const data = snapshot.val();
					setHighScore(data);
				});
			}
		});
		onAuthStateChanged(auth, (user) => {
			if (user) {
				const dataRef = ref(db, `/${auth.currentUser.uid}`);
				onValue(dataRef, (snapshot) => {
					const data = snapshot.val();
					delete data.highScore;
					const dataArray = Object.entries(data);
					const sortedArray = dataArray.sort((a, b) => {
						return moment(a[1].time).isBefore(moment(b[1].time));
					});
					setResults(sortedArray);
				});
			}
		});
		$.getJSON("./Data.json", function (json) {
			var array = [];
			for (var key in json) {
				if (json.hasOwnProperty(key)) {
					var item = json[key];
					array.push({
						name: key,
						Stars: item.Stars,
						Language: item.Language,
						Description: item.Description,
						URL: item.URL,
						Domain: item.Domain,
						GrowthPattern: item["Growth Pattern"],
						README: item.URL + "/blob/main/README.md",
					});
				}
			}
			setData(array);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		if (loading) {
			return;
		} else {
			// randomly select a left item
			const leftItem = data[Math.floor(Math.random() * data.length)];
			setLeft(leftItem);
			// randomly select a right item that isnt the left item
			let rightItem = data[Math.floor(Math.random() * data.length)];
			while (rightItem.name === leftItem.name) {
				rightItem = data[Math.floor(Math.random() * data.length)];
			}
			setRight(rightItem);
		}
	}, [loading]);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleOpenLost = () => {
		setOpenLost(false);
	};

	// make a click handler for the right buttons that check whether the right item's Stars
	// is greater than the left item's Stars. If it is, then set the right item to the left and add 1 to score
	// if it isnt, stop
	const handleHigherClick = () => {
		if (right.Stars > left.Stars) {
			setLeft(right);
			// randomly select a new right item that isnt the left item
			const newRight = data[Math.floor(Math.random() * data.length)];
			if (newRight.name === left.name) {
				handleHigherClick();
			} else {
				setRight(newRight);
			}
			setScore(score + 1);
		} else {
			setLastScore(score);
			setScore(0);
			setOpenLost(true);
			let leftItem = data[Math.floor(Math.random() * data.length)];
			let rightItem = data[Math.floor(Math.random() * data.length)];
			while (rightItem.name === leftItem.name) {
				rightItem = data[Math.floor(Math.random() * data.length)];
			}
			setLeft(leftItem);
			setRight(rightItem);
			setUuid(uid());
			setTime(moment().format("MMMM Do YYYY, h:mm:ssa"));
		}
	};

	const handleLowerClick = () => {
		if (right.Stars < left.Stars) {
			setLeft(right);
			const newRight = data[Math.floor(Math.random() * data.length)];
			if (newRight.name === left.name) {
				handleLowerClick();
			} else {
				setRight(newRight);
			}
			setScore(score + 1);
		} else {
			setLastScore(score);
			setScore(0);
			setOpenLost(true);
			let leftItem = data[Math.floor(Math.random() * data.length)];
			let rightItem = data[Math.floor(Math.random() * data.length)];
			while (rightItem.name === leftItem.name) {
				rightItem = data[Math.floor(Math.random() * data.length)];
			}
			setLeft(leftItem);
			setRight(rightItem);
			setUuid(uid());
			setTime(moment().format("MMMM Do YYYY, h:mm:ssa"));
		}
	};

	// function that upload the lastScore together with current Time to the firebase realtime database

	const uploadScore = () => {
		const data = {
			time: time,
			score: lastScore,
		};
		console.log(data);
		set(ref(db, `/${auth.currentUser.uid}/${uuid}`), data);
		// if the lastScore is greater than the highScore, then set the highScore to the lastScore
		if (lastScore > highScore) {
			setHighScore(lastScore);
			// update the highScore in the firebase realtime database
			set(ref(db, `/${auth.currentUser.uid}/highScore`), lastScore);
		}
		setShowUpload(false);
	};

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<Navbar
				highScore={highScore}
				setHighScore={setHighScore}
				results={results}
			/>
			<Modal
				open={openLost}
				onClose={handleOpenLost}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				css={{
					overflow: "auto",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "32px",
						gap: "32px",
						position: "relative",
						margin: "96px auto 32px",
						marginTop: "96px",
						marginBottom: "32px",
						maxWidth: "520px",
						backgroundColor: "white",
						boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.5)",
						borderRadius: "16px",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							padding: "0px",
							gap: "12px",
							fontSize: "26px",
						}}
					>
						<div>You Lost!</div>
						<div>
							<div
								style={{
									border: "1px solid lightgrey",
									backgroundColor: "lightgrey",
									width: "32px",
									height: "32px",
									borderRadius: "16px",
									fontSize: 20,
									alignSelf: "center",
									position: "absolute",
									top: "5%",
									right: "5%",
									cursor: "pointer",
								}}
							>
								<CloseIcon
									style={{
										position: "relative",
										top: "4px",
										left: "4px",
									}}
									onClick={handleOpenLost}
								></CloseIcon>
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Button
									variant="contained"
									onClick={uploadScore}
									style={{
										visibility: showUpload ? "visible" : "hidden",
									}}
								>
									Upload Score!
								</Button>
								<span
									style={{
										color: "black",
										fontSize: "20px",
										whiteSpace: "pre-wrap",
									}}
								>
									You Scored {lastScore}
									{"\n"}
									This Project is made by Jacky Lee @ 2022 {"\n"}
									{"\n"} Data Set From Kaggle
								</span>
							</div>
						</div>
					</div>
				</div>
			</Modal>
			<div style={{ width: "100%" }}>
				<span
					style={{
						display: "table",
						width: "100%",
						textAlign: "center",
						alignContent: "center",
					}}
				>
					Current Score: {score}
				</span>
				<div
					className="choices"
					style={{
						display: "flex",
						flexDirection: "row",
						height: "100%",
						minHeight: "100vh",
					}}
				>
					<div
						className="left"
						style={{
							// backgroundColor: "blue",
							width: "50%",
							height: "100%",
							minHeight: "100vh",
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								margin: "auto",
								gap: "12px",
								fontSize: "26px",
							}}
						>
							{left.name}
						</div>
					</div>
					<div
						className="right"
						style={{
							// backgroundColor: "green",
							width: "50%",
							height: "100%",
							minHeight: "100vh",
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								margin: "auto",
								gap: "12px",
								fontSize: "26px",
							}}
						>
							{right.name}
						</div>
					</div>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						width: "100%",
						margin: "auto",
						gap: "12px",
						alignContent: "center",
						alignSelf: "center",
						// center horizontally
						position: "absolute",
						top: "50%",
						left: "35%",
					}}
				>
					<Typography variant="h4" component="h3" style={{}}>
						Is {right.name} Higher or Lower?
					</Typography>
					<Button
						variant="contained"
						style={{ borderRadius: "12px", width: "30%" }}
						onClick={handleHigherClick}
					>
						Higher
					</Button>
					<Button
						variant="contained"
						style={{ borderRadius: "12px", width: "30%" }}
						onClick={handleLowerClick}
					>
						Lower
					</Button>
				</div>
			</div>
		</div>
	);
}
