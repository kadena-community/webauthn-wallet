'use client';

// import { transfer } from '@/utils/transfer';
import { Breadcrumbs, BreadcrumbsItem, Button, TextField } from '@kadena/react-ui';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

const FORM_DEFAULTS = {
  to: '',
  amount: 0,
};
type FormValues = typeof FORM_DEFAULTS;

export default function SendPage() {
  const params = useParams();
  const router = useRouter();
  const { getValues, handleSubmit, register } = useForm({
    defaultValues: FORM_DEFAULTS,
    reValidateMode: 'onBlur',
  });
  const onSubmit = async (data: FormValues) => {
    console.log(data);
    router.push(`/accounts/${params.caccount}/devices/${params.cid}/transactions`);
  };
  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbsItem href={`/accounts/${params.caccount}`}>
          {decodeURIComponent(params.caccount.toString())}
        </BreadcrumbsItem>
        <BreadcrumbsItem href={`/accounts/${params.caccount}/devices/${params.cid}`}>
          {decodeURIComponent(params.cid.toString())}
        </BreadcrumbsItem>
        <BreadcrumbsItem>
          Send
        </BreadcrumbsItem>
      </Breadcrumbs>
      <h1>Send</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField id="to" label="To" {...register('to')} />
        <TextField
          id="amount"
          type="number"
          label="Amount"
          {...register('amount')}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
