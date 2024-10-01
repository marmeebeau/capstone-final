import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authServices from '../services/authServices';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // Use isAdmin from AuthContext

  useEffect(() => {
    const checkAdmin = () => {
      if (!isAdmin()) {
        navigate('/'); // Redirect if not admin
      } else {
        fetchUsers(); // Fetch users if admin
      }
    };

    checkAdmin();
  }, [isAdmin, navigate]); // Add isAdmin and navigate to the dependency array

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await authServices.getUsers(); // Fetch users from backend
      setUsers(response);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error(err);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Manage Users</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th> {/* Added first name column */}
            <th>Last Name</th>  {/* Added last name column */}
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Contact</th> {/* Added contact column */}
            <th>Address</th> {/* Added address column */}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.coor_fname}</td> {/* Display first name */}
              <td>{user.coor_lname}</td> {/* Display last name */}
              <td>{user.coor_username}</td>
              <td>{user.coor_email}</td>
              <td>{user.coor_role}</td>
              <td>{user.coor_contact}</td> {/* Display contact information */}
              <td>{user.coor_address}</td> {/* Display address */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
