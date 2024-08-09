import { useState } from 'react';
import { InvoiceTable } from '../../components/Invoice/InvoiceTable';
import { SearchInvoice } from '../../components/Invoice/SearchInvoice';
import { FilterInvoice } from '../../components/Invoice/FilterInvoice';
// import { NewInvoiceForm } from '../../components/Invoice/NewInvoiceForm';
import { AddNewInvoiceButton } from '../../components/Invoice/AddNewInvoiceButton'; //
import styles from './Faktury.module.css';
import { Outlet, useLocation } from 'react-router-dom';

export const Faktury = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>({});

  const isAddInvoiceRoute = location.pathname.includes('add-invoice');
  const isEditInvoiceRoute = location.pathname.includes('edit-invoice');
  const isDetailsInvoiceRoute = location.pathname.includes('details-invoice');

  const shouldShowInvoiceList = !isAddInvoiceRoute && !isEditInvoiceRoute && !isDetailsInvoiceRoute;

  return (
    <div>
      {shouldShowInvoiceList && (
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Faktury</h1>
            <div className={styles.actions}>
              <SearchInvoice onSearch={setSearchTerm} />
              <FilterInvoice onFilter={setFilterOptions} />
              <AddNewInvoiceButton />
            </div>
          </div>
          <InvoiceTable searchTerm={searchTerm} filterOptions={filterOptions} />
        </div>
      )}
      <Outlet />
    </div>
  );
};