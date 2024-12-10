import React, { useEffect, useState } from 'react';
import './App.css'
function App() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [result, setResult] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => {
                setResult(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    function handleData() {
        const userName = name.trim();
        const userEmail = email.trim();
        const userWebsite = website.trim();

        if (!userName || !userEmail || !userWebsite) {
            alert("All fields are required!");
            return;
        }

        if (editUser) {
            fetch(`https://jsonplaceholder.typicode.com/users/${editUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
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
            fetch('https://jsonplaceholder.typicode.com/users', {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    name: userName,
                    email: userEmail,
                    website: userWebsite,
                }),
            })
                .then((res) => res.json())
                .then((newUser) => {
                    const userWithId = { ...newUser, id: result.length + 1 };
                    setResult([...result, userWithId]);
                    setName('');
                    setEmail('');
                    setWebsite('');
                });
        }
    }

    function handleDelete(id) {
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { method: 'DELETE' })
            .then(() => setResult(result.filter((predata) => predata.id !== id)))
            .catch((err) => console.log("Error occurred during delete process", err));
    }

    function handleEdit(user) {
        setName(user.name);
        setEmail(user.email);
        setWebsite(user.website);
        setEditUser(user);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <label>Enter User Name</label>
            <input type='text' placeholder='Enter User Name' value={name} onChange={(e) => setName(e.target.value)} /> <br />
            <label>Enter User Email</label>
            <input type='email' placeholder='Enter User Email' value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
            <label>Enter User Website</label>
            <input type='text' placeholder='Enter User Website' value={website} onChange={(e) => setWebsite(e.target.value)} /><br />
            <button onClick={handleData}>{editUser ? "Update User" : "Add New Data"}</button>

            <table border={1}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>User Website</th>
                        <th>Update User Details</th>
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

export default App;
