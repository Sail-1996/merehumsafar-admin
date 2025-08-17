import React, { useState } from 'react'
import RequestQuotationListing from '../components/listing/RequestQuotationListing';
import AlertBox from '../components/widget/AlertBox';

export default function QuotationList() {
      const [search, setSearch] = useState('');
   
  return (
    <div className='relative'>
         <RequestQuotationListing  />

    </div>
  )
}
