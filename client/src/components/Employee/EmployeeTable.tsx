import React, { useState, useEffect } from 'react';
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

const employees: Employee[] = [
  { 
    id: 1,
    name: 'Adam Kowalski',
    email: 'adam.kowalski@firma.com',
    contract: 'Umowa o pracę',
    phoneNumber: '123456789',
    address: 'Warszawa, Aleje Jerozolimskie 100',
    position: 'Kierownik projektu',
    role: 'Administrator',
  },
  {
    id: 2,
    name: 'Ewa Nowak',
    email: 'ewa.nowak@firma.com',
    contract: 'Umowa zlecenie',
    phoneNumber: '987654321',
    address: 'Kraków, ul. Rynek 5',
    position: 'Programista',
    role: 'Użytkownik',
  },
  {
    id: 3,
    name: 'Piotr Wiśniewski',
    email: 'piotr.wisniewski@firma.com',
    contract: 'Umowa Zlecenie',
    phoneNumber: '567890123',
    address: 'Gdańsk, Plac Solidarności 1',
    position: 'Analityk',
    role: 'Administrator',
  },
  {
    id: 4,
    name: 'Anna Lewandowska',
    email: 'anna.lewandowska@firma.com',
    contract: 'Umowa o pracę',
    phoneNumber: '234567890',
    address: 'Łódź, ul. Piotrkowska 50',
    position: 'Specjalista ds. HR',
    role: 'Administrator',
  },
  {
    id: 5,
    name: 'Marek Nowakowski',
    email: 'marek.nowakowski@firma.com',
    contract: 'Umowa o dzieło',
    phoneNumber: '678901234',
    address: 'Wrocław, Plac Grunwaldzki 10',
    position: 'Architekt',
    role: 'Użytkownik',
  }
];

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ searchTerm, filterOptions }) => {
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const itemsPerPageOptions: number[] = [10, 20, 30, 50];

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
  }, [searchTerm, filterOptions]);

  const indexOfLastEmployee: number = currentPage * itemsPerPage;
  const indexOfFirstEmployee: number = indexOfLastEmployee - itemsPerPage;
  const currentEmployees: Employee[] = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
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
            <EmployeeRow key={employee.id} employee={employee} />
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
