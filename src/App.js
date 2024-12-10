import React, { useEffect, useState } from 'react';
import './App.css'
function Gallery2() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [result, setResult] = useState([]);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => setResult(data));
    }, []);

    function handleData() {
        const userName = name.trim();
        const userEmail = email.trim();
        const userWebsite = website.trim();

        if (userName && userEmail && userWebsite) {
            if (editUser) {
                // Update existing user
                fetch(`https://jsonplaceholder.typicode.com/users/${editUser.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        id: editUser.id,
                        name: userName,
                        email: userEmail,
                        website: userWebsite,
                    }),
                })
                    .then((res) => res.json())
                    .then((updatedUser) => {
                        setResult(result.map((user) =>
                            user.id === updatedUser.id ? updatedUser : user
                        ));
                        setEditUser(null);
                        setName('');
                        setEmail('');
                        setWebsite('');
                    });
            } else {
                // Add new user
                fetch('https://jsonplaceholder.typicode.com/users', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        name: userName,
                        email: userEmail,
                        website: userWebsite,
                    }),
                })
                    .then((res) => res.json())
                    .then((newUser) => setResult([...result, newUser]));
            }
        }
    }

    function handleDelete(id) {  
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
          method: 'DELETE',
      })
          .then(() => setResult(result.filter((predata) => predata.id !== id)))
          .catch((err) => console.log("Error occurred during delete process", err));
  }

    function handleEdit(user) {
        setName(user.name);
        setEmail(user.email);
        setWebsite(user.website);
        setEditUser(user);
    }

    return (
        <div>
            <label>Enter User Name</label>
            <input type='text' placeholder='Enter User Name' value={name} onChange={(e) => setName(e.target.value)}></input> <br />
            <label>Enter User Email</label>
            <input type='email' placeholder='Enter User Email' value={email} onChange={(e) => setEmail(e.target.value)}></input> <br />
            <label>Enter User Website</label>
            <input type='text' placeholder='Enter User Website' value={website} onChange={(e) => setWebsite(e.target.value)}></input><br />
            <button onClick={handleData}>{editUser ? "Update User" : "Add New Data"}</button>

            <table border={1}>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>User Name</td>
                        <td>User Email</td>
                        <td>User Website</td>
                        <td>Update User Details</td>
                    </tr>
                </thead>
                <tbody>
                    {result.map((res) => (
                        <tr key={res.id}>
                            <td>{res.id}</td>
                            <td>{res.name}</td>
                            <td>{res.email}</td>
                            <td>{res.website}</td>
                            <td>
                                <button onClick={() => handleEdit(res)}>Edit</button>
                                <button onClick={() => handleDelete(res.id)} className='DeleteButton'>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Gallery2