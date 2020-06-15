import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { Icon } from "../components/Icon";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Modal } from "../components/Modal";
import { useHttpClient } from "../hooks/use-http-client";
import { selectUserDetails } from "../store/auth.state";
import { Role, roles } from "../types/roles.type";
import { User } from "../types/user.type";
import { DeleteResource } from "./dialogs/DeleteResource";
import { UpsertUser } from "./dialogs/UpsertUser";
import { ResetPassword } from "./dialogs/ResetPassword";
import { usersFetchStatus } from "../store/http-request.state";

type ModalWindows = "none" | "user" | "delete" | "resetPassword";

export const UserManager = () => {
	const [visibleModal, setVisibleModal] = useState("none" as ModalWindows);
	const [selectedUser, setSelectedUser] = useState(null as User | null);
	const [users, setUsers] = useState([] as User[]);
	const [usersStatus, setUsersStatus] = useRecoilState(usersFetchStatus);

	const http = useHttpClient();
	const userDetails = useRecoilValue(selectUserDetails);

	useEffect(() => {
		setUsersStatus("initial");
	}, []);

	const fetchUsers = async () => {
		if (!["loading", "loaded", "error"].includes(usersStatus)) {
			setUsersStatus("loading");
			setUsers([]);
			try {
				const result = await http.request({
					method: "GET",
					uri: `users${userDetails?.role === "user" ? `/${userDetails.id}` : ""}`,
					withAuth: true,
				});
				if (Array.isArray(result)) {
					setUsers(result);
					setUsersStatus("loaded");
				} else {
					setUsersStatus("error");
				}
			} catch (error) {
				setUsersStatus("error");
			}
		}
	};
	useEffect(() => {
		console.log(usersStatus);
		fetchUsers();
	}, [usersStatus]);

	const closeModal = () => {
		setVisibleModal("none");
	};

	return (
		<>
			<div className="page">
				{userDetails?.role !== "userManager" && (
					<Link to="/dashboard">Dashboard /</Link>
				)}
				<h2 className="page__title">User manager</h2>
				<div className="buttonRow">
					{userDetails?.role !== "user" && (
						<button
							onClick={() => {
								setSelectedUser(null);
								setVisibleModal("user");
							}}
							className="button button__secondary"
						>
							<Icon withMargin="left">person</Icon>Add a user
						</button>
					)}
					<button
						onClick={() => {
							setVisibleModal("resetPassword");
						}}
						className="button button__secondary"
					>
						<Icon withMargin="left">lock</Icon>Reset your password
					</button>
				</div>
				{usersStatus === "loading" && <LoadingSpinner />}
				{usersStatus === "error" && (
					<p className="paragraph paragraph--error card">
						<Icon withMargin="left">error</Icon> Something went wrong loading users.
						Please try again later.
					</p>
				)}
				{usersStatus === "loaded" && (
					<>
						{users.length === 0 && (
							<p className="paragraph card">No users to show.</p>
						)}
						{users.length >= 1 && (
							<table className="table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Email</th>
										<th>Role</th>
										<th>Active</th>
										<th></th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{users.map((user) => (
										<tr key={user.id}>
											<td>{user.name}</td>
											<td>{user.email}</td>
											<td>{roles[user.role as Role]}</td>
											<td>
												{user.isDeleted ? <Icon>thumb_down</Icon> : <Icon>thumb_up</Icon>}
											</td>
											<td className="table__cell--fixedWidth">
												<button
													onClick={() => {
														setSelectedUser(user);
														setVisibleModal("user");
													}}
													className="button button__secondary"
												>
													<Icon withMargin="left">edit</Icon>Edit
												</button>
											</td>
											<td className="table__cell--fixedWidth">
												{!user.isDeleted && (
													<button
														className="button button__destructive"
														onClick={() => {
															setSelectedUser(user);
															setVisibleModal("delete");
														}}
													>
														<Icon withMargin="left">delete</Icon>Delete
													</button>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</>
				)}
			</div>
			<Modal
				isVisible={visibleModal === "delete"}
				onClose={closeModal}
				title="Delete user"
			>
				<DeleteResource
					updateFetchStatus={setUsersStatus}
					closeDialog={closeModal}
					uri={`users/${selectedUser?.id}`}
					resourceName="user"
				/>
			</Modal>
			<Modal
				isVisible={visibleModal === "resetPassword"}
				onClose={closeModal}
				title="Reset your password"
			>
				<ResetPassword closeDialog={closeModal} />
			</Modal>
			<Modal
				isVisible={visibleModal === "user"}
				onClose={closeModal}
				title={selectedUser ? "Edit user" : "Create user"}
			>
				<UpsertUser closeDialog={closeModal} user={selectedUser} />
			</Modal>
		</>
	);
};
