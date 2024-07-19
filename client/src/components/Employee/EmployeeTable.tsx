import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EmployeeTable.module.css';
import Pagination from './Pagination';
import { EmployeeRow } from './EmployeeRow';

interface Employee {
  id: number;
  name: string;
  email: string;
  contract: string;
  phoneNumber: string;
  address: string;
  position: string;
  role: string;
}

interface EmployeeTableProps {
  searchTerm: string;
  filterOptions: { [key: string]: string };
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ searchTerm, filterOptions }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const itemsPerPageOptions: number[] = [10, 20, 30, 50];

  useEffect(() => {
    axios.get('http://localhost:3000/employees')
      .then(response => {
        const apiEmployees = response.data.map((user: any) => {
          const userData = user.UserData[0] || {};
          const userRole = user.UserRole[0] || {};
          return {
            id: user.user_id,
            name: `${userData.first_name || ''} ${userData.second_name || ''}`,
            email: user.email,
            contract: userData.contract || 'N/A',
            phoneNumber: userData.tel_number || 'N/A',
            address: userData.address || 'N/A',
            position: userData.Position?.name || 'N/A',
            role: userRole.Role?.name || 'N/A',
          };
        });
        setEmployees(apiEmployees);
        setFilteredEmployees(apiEmployees);
      })
      .catch(error => {
        console.error('There was an error fetching the employees!', error);
      });
  }, []);

  useEffect(() => {
    let results = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (Object.keys(filterOptions).length > 0) {
      results = results.filter(employee => {
        return Object.entries(filterOptions).every(([key, value]) => {
          return employee[key as keyof Employee].toString().toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    setFilteredEmployees(results);
    setCurrentPage(1);
  }, [searchTerm, filterOptions, employees]);

  const indexOfLastEmployee: number = currentPage * itemsPerPage;
  const indexOfFirstEmployee: number = indexOfLastEmployee - itemsPerPage;
  const currentEmployees: Employee[] = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    // Remove employee from the local state after successful deletion
    setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
    setFilteredEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Imię i Nazwisko</th>
            <th>Adres e-mail</th>
            <th>Umowa</th>
            <th>Numer telefonu</th>
            <th>Adres zamieszkania</th>
            <th>Stanowisko</th>
            <th>Rola</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee) => (
            <EmployeeRow key={employee.id} employee={employee} onDelete={handleDelete} />
          ))}
        </tbody>
      </table>
      <Pagination
        itemsPerPageOptions={itemsPerPageOptions}
        itemsPerPage={itemsPerPage}
        totalItems={filteredEmployees.length}
        currentPage={currentPage}
        paginate={paginate}
        changeItemsPerPage={changeItemsPerPage}
      />
    </div>
  );
};
