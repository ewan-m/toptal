import * as React from "react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Icon } from "../components/Icon";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Modal } from "../components/Modal";
import { useHttpClient } from "../hooks/use-http-client";
import { selectUserDetails } from "../store/auth.state";
import { Role, roles } from "../types/roles.type";
import { DeleteResource } from "./dialogs/DeleteResource";
import { Link } from "react-router-dom";
import { User } from "./dialogs/User";

enum Situation {
	loading,
	loaded,
	error,
}

type ModalWindows = "none" | "user" | "delete";

export const UserManager = () => {
	const [situation, setSituation] = useState(Situation.loading);
	const [visibleModal, setVisibleModal] = useState("none" as ModalWindows);
	const [selectedUser, setSelectedUser] = useState(null as any);
	const [users, setUsers] = useState([] as any[]);
	const http = useHttpClient();
	const userDetails = useRecoilValue(selectUserDetails);

	const fetchUsers = async () => {
		setUsers([]);
		setSituation(Situation.loading);
		try {
			const result = await http.request({
				method: "GET",
				uri: `users${userDetails?.role === "user" ? `/${userDetails.id}` : ""}`,
				withAuth: true,
			});
			if (Array.isArray(result)) {
				setUsers(result);
				setSituation(Situation.loaded);
			} else {
				setSituation(Situation.error);
			}
		} catch (error) {
			setSituation(Situation.error);
		}
	};
	useEffect(() => {
		fetchUsers();
	}, []);

	const closeModal = () => {
		fetchUsers();
		setVisibleModal("none");
	};

	return (
		<>
			<div className="page">
				<Link to="/dashboard">Dashboard /</Link>
				<h2 className="page__title">User manager</h2>
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
				{situation === Situation.loading && <LoadingSpinner />}
				{situation === Situation.loaded && (
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
												<button
													className="button button__destructive"
													onClick={() => {
														setSelectedUser(user);
														setVisibleModal("delete");
													}}
												>
													<Icon withMargin="left">delete</Icon>Delete
												</button>
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
					closeDialog={closeModal}
					uri={`users/${selectedUser?.id}`}
					resourceName="user"
				/>
			</Modal>
			<Modal
				isVisible={visibleModal === "user"}
				onClose={closeModal}
				title={selectedUser ? "Edit user" : "Create user"}
			>
				<User closeDialog={closeModal} user={selectedUser} />
			</Modal>
		</>
	);
};
