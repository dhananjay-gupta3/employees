import { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import './Employee.css';

const Employee = () => {
    const [rowData, setRowData] = useState([]);
    const [form, setForm] = useState({ name: '', role: '', department: '', email: '' });
    const [editId, setEditId] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const gridRef = useRef();

    const API_URL = "http://localhost:5000/api";

    const columnDefs = [
        { headerName: 'Name', field: 'name', filter: true, sortable: true, flex: 1, minWidth: 150 },
        { headerName: 'Role', field: 'role', filter: true, sortable: true, flex: 1, minWidth: 120 },
        { headerName: 'Department', field: 'department', filter: true, sortable: true, flex: 1, minWidth: 150 },
        { headerName: 'Email', field: 'email', filter: true, sortable: true, flex: 1, minWidth: 180 },
        {
            headerName: 'Actions',
            cellRenderer: (params) => (
                <div className="action-buttons">
                    <button
                        onClick={() => handleEdit(params.data)}
                        className="btn-edit"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(params.data._id)}
                        className="btn-delete"
                    >
                        Delete
                    </button>
                </div>
            ),
            width: 180,
            suppressSizeToFit: true,
            cellStyle: { overflow: 'visible' }
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (gridRef.current?.api) {
            gridRef.current.api.setFilterModel({
                name: {
                    type: 'contains',
                    filter: filterText,
                },
                email: {
                    type: 'contains',
                    filter: filterText,
                }
            });
            gridRef.current.api.onFilterChanged();
        }
    }, [filterText]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setRowData(res.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!form.name.trim()) errors.name = 'Name is required';
        if (!form.role.trim()) errors.role = 'Role is required';
        if (!form.department.trim()) errors.department = 'Department is required';
        if (!form.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            errors.email = 'Invalid email format';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        try {
            if (editId) {
                await axios.put(`${API_URL}/${editId}`, form);
                setSuccess('Employee updated successfully');
            } else {
                const emailExists = rowData.some(emp =>
                    emp.email.toLowerCase() === form.email.toLowerCase() &&
                    emp._id !== editId
                );

                if (emailExists) {
                    setFormErrors({ ...formErrors, email: 'Email already exists' });
                    return;
                }

                await axios.post(API_URL, form);
                setSuccess('Employee added successfully');
            }
            resetForm();
            fetchData();
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        }
    };

    const resetForm = () => {
        setForm({ name: '', role: '', department: '', email: '' });
        setEditId(null);
        setShowModal(false);
        setFormErrors({});
    };

    const handleEdit = (employee) => {
        setForm(employee);
        setEditId(employee._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setSuccess('Employee deleted successfully');
                fetchData();
            } catch (error) {
                setError('Failed to delete employee');
            }
        }
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (success) setSuccess('');
            if (error) setError('');
        }, 3000);

        return () => clearTimeout(timer);
    }, [success, error]);

    return (
        <div className="employee-container">
            <div className="header-section">
                <h1>Employee Management</h1>
                <div className="filter-control">
                   Filter by Name <input
                        type="text"
                        placeholder="Search employees..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="filter-input"
                    />
                </div>
            </div>

            <div className="main-controls">
                <button onClick={openAddModal} className="btn-add">
                    Add Employee
                </button>
            </div>

            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editId ? 'Edit Employee' : 'Add Employee'}</h2>
                            <button className="close-btn" onClick={resetForm}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="employee-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                                {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <input
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                />
                                {formErrors.role && <span className="error-text">{formErrors.role}</span>}
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input
                                    value={form.department}
                                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                                />
                                {formErrors.department && <span className="error-text">{formErrors.department}</span>}
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                                {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-submit">
                                    {editId ? 'Update' : 'Add'}
                                </button>
                                <button type="button" onClick={resetForm} className="btn-cancel">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="ag-theme-alpine-dark" style={{ height: 400, width: '100%' }}>
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading employees...</p>
                    </div>
                ) : (
                    <AgGridReact
                        ref={gridRef}
                        columnDefs={columnDefs}
                        rowData={rowData}
                        pagination={true}
                        paginationPageSize={10}
                        domLayout="autoHeight"
                        suppressCellFocus={true}
                            theme="legacy" 
                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                    />
                )}
            </div>
        </div>
    );
};

export default Employee;