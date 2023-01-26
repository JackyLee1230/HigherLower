import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { auth, db } from "../firebase.jsx";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { set, ref, onValue, remove, update } from "firebase/database";

function Login() {
	const navigate = useNavigate();
	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		console.log({
			email: data.get("email"),
			password: data.get("password"),
		});
	};

	useEffect(() => {
		document.title = "Higher Or Lower By Jacky Lee";
		auth.onAuthStateChanged((user) => {
			if (user) {
				navigate("/homepage");
			}
		});
	}, []);

	const googlePopupSignIn = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then(() => {
				set(ref(db, `/${auth.currentUser.uid}/highScore`), 0);
				navigate("/homepage");
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	return (
		<>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LoginIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Higher Or Lower
					</Typography>
					<Typography component="h1" variant="h5">
						DataSet From &nbsp;
						<a href="https://www.kaggle.com/" target="_blank" rel="noreferrer">
							Kaggle
						</a>
					</Typography>

					<Button
						onClick={googlePopupSignIn}
						fullWidth
						variant="contained"
						sx={{ mt: 8, mb: 4 }}
					>
						Google Sign In
					</Button>
				</Box>
				<Typography
					variant="body2"
					color="text.secondary"
					align="center"
					sx={{ mt: 8, mb: 4 }}
				>
					{"Copyright © "}
					<Link color="inherit" href="https://www.itzjacky.info">
						Jacky Lee
					</Link>
					&nbsp;
					{new Date().getFullYear()}
					{"."}
				</Typography>
			</Container>
		</>
	);
}

export default Login;
