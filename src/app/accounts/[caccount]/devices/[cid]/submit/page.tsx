'use client';

import { useSubmit } from '@/hooks/useSubmit';
import { useEffect } from 'react';

type SubmitPageProps = {
  searchParams: {
    payload: string;
  };
};
export default function SubmitPage({ searchParams }: SubmitPageProps) {
  const { doSubmit, status, result, SubmitStatus } = useSubmit(searchParams);
  useEffect(() => {
    if (status !== SubmitStatus.SUBMITABLE) return;
    doSubmit();
  }, [SubmitStatus]);
  if (status !== SubmitStatus.SUCCESS) return <div>loading...</div>;
  return (
    <div>
      <h1>Success!</h1>
      <p>{result}</p>
    </div>
  );
}
