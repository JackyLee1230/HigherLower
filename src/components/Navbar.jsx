// create a navbar component that will be used in the app
//
// Path: src\components\Navbar.js
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Avatar,
	Badge,
	Modal,
	Pagination,
	Chip,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import QuestionIcon from "@mui/icons-material/QuestionMark";
import ListIcon from "@mui/icons-material/List";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase.jsx";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import useHover from "./useHover";
import { styled } from "@mui/material/styles";
import { set, ref, onValue, remove, update } from "firebase/database";

function Navbar(props) {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [openInfo, setOpenInfo] = useState(false);
	const [openResults, setOpenResults] = useState(false);
	const [resultsPageIndex, setesultsPageIndex] = useState(0);
	const handleOpenInfo = () => setOpenInfo(true);
	const handleCloseInfo = () => setOpenInfo(false);
	const handleOpenResults = () => setOpenResults(true);
	const handleCloseResults = () => setOpenResults(false);

	const handleResultsPageChange = (event, value) => {
		setesultsPageIndex(value - 1);
	};

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setUser(user);
			}
		});
	}, []);

	const handleSignOut = () => {
		auth.signOut().then(() => {
			navigate("/");
		});
	};

	const StyledBadge = styled(Badge)(({ theme }) => ({
		"& .MuiBadge-badge": {
			backgroundColor: "#44b700",
			color: "#44b700",
			boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
			"&::after": {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				borderRadius: "50%",
				animation: "ripple 1.2s infinite ease-in-out",
				border: "1px solid currentColor",
				content: '""',
			},
		},
		"@keyframes ripple": {
			"0%": {
				transform: "scale(0.7) translate('50px')",
				opacity: 1,
			},
			"100%": {
				transform: "scale(2.4) translate('50px')",
				opacity: 0,
			},
		},
	}));

	const logoutHover = useHover(
		{
			opacity: 0.7,
			marginLeft: "auto",
			cursor: "pointer",
			gap: "5px",
			fontFamily: "Roboto",
		},
		{ marginLeft: "auto", cursor: "pointer", gap: "5px", fontFamily: "Roboto" }
	);

	return (
		<>
			{/* Past Results Modal */}
			<Modal
				open={openResults}
				onClose={handleCloseResults}
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
						minHeight: "35%",
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
						<div>Past Results</div>
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
									onClick={handleCloseResults}
								></CloseIcon>
							</div>
							<div>
								<span
									style={{
										color: "black",
										fontSize: "20px",
										whiteSpace: "pre-wrap",
										alignContent: "center",
										textAlign: "center",
										width: "100%",
									}}
								>
									<span style={{ textAlign: "center", width: "100%" }}>
										You Have Played {props.results.length} times
									</span>

									<TableContainer component={Paper}>
										<Table aria-label="simple table">
											<TableHead>
												<TableRow>
													<TableCell>Game ID</TableCell>
													<TableCell align="right">Date</TableCell>
													<TableCell align="right">Score</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{props.results
													.slice(5 * resultsPageIndex, 5 * resultsPageIndex + 5)
													.map((row, i) => (
														<TableRow key={row[0]}>
															<TableCell component="th" scope="row">
																{row[0]}
															</TableCell>
															<TableCell align="right">{row[1].time}</TableCell>
															<TableCell align="right">
																{row[1].score}
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</TableContainer>
									{props.results.length > 5 && (
										<Pagination
											count={Math.ceil(props.results.length / 5)}
											page={resultsPageIndex + 1}
											onChange={handleResultsPageChange}
											style={{
												display: "flex",
												alignSelf: "center",
												position: "absolute",
												left: "30%",
												bottom: "5%",
											}}
											color="secondary"
										/>
									)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</Modal>
			{/* About This Modal */}
			<Modal
				open={openInfo}
				onClose={handleCloseInfo}
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
						<div>About This Higher Or Lower Project</div>
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
									onClick={handleCloseInfo}
								></CloseIcon>
							</div>
							<div>
								<span
									style={{
										color: "black",
										fontSize: "20px",
										whiteSpace: "pre-wrap",
									}}
								>
									This Project is made by Jacky Lee @ 2022 {"\n"}
									Contact Me @
									<a href="mailto:justjackypvp@gmail.com?subject=ToDo App">
										justjackypvp@gmail.com
									</a>
									{"\n"}
									This Web App is Deployed on &nbsp;
									<a href="https://www.vercel.com">Vercel</a>
									{"\n"}
									Technologies Used:{"\n"}
									{"\t"}React.JS{"\n"}
									{"\t"}Firebase{"\n"}
									{"\t"}Material-UI{"\n"}
									{"\n"}
									{"\n"} Thanks For Checking Out My Project!
									{"\n"} Data Set From Kaggle
								</span>
							</div>
						</div>
					</div>
				</div>
			</Modal>
			{user ? (
				<AppBar position="absokute" style={{ positionAbsoltue: "0 0" }}>
					<Toolbar>
						<div
							variant="h6"
							style={{ fontFamily: "Roboto", alignItems: "center" }}
						>
							Higher/Lower
							<QuestionIcon
								style={{
									fill: "grey",
									marginLeft: "5px",
									cursor: "pointer",
									border: "1px solid lightblue",
									backgroundColor: "lightblue",
									borderRadius: "16px",
									fontSize: 20,
									alignSelf: "center",
									position: "absolute",
								}}
								onClick={handleOpenInfo}
							/>
						</div>
						{user && (
							<>
								<Button
									style={{
										marginLeft: "43%",
										display: "flex",
										flexDirection: "row",
										boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.5)",
									}}
									onClick={handleOpenResults}
									variant="contained"
									color="success"
								>
									High Score:{props.highScore}
									<ListIcon
										style={{
											scale: "1.5",
											marginLeft: "10px",
											cursor: "pointer",
											fontSize: 20,
											alignSelf: "center",
										}}
									/>
								</Button>
								<Button
									onClick={handleSignOut}
									variant="contained"
									color="secondary"
									{...logoutHover}
								>
									<StyledBadge
										overlap="circular"
										anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
										variant="dot"
									>
										<Avatar
											alt={user.displayName}
											src={user.photoURL}
											style={{ marginLeft: "auto", cursor: "pointer" }}
										/>
									</StyledBadge>
									Sign Out
								</Button>
							</>
						)}
					</Toolbar>
				</AppBar>
			) : null}
		</>
	);
}

export default Navbar;
