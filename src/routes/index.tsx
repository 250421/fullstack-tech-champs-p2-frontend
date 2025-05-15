import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';

// Hooks (tanStack Query)
import { useExample } from '../hooks/useExample';

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {

    // Product Data
  const { data, isLoading, isError } = useExample();

  useEffect(() => {
    if (data) {
      console.log("EXAMPLE DATA FROM TANSTACK QUERY", data);
    }
  }, [data]);

  return (
    <div className="p-2">
        <h1 className="text-3xl font-bold underline">
            Hello world!
        </h1>
    </div>
  )
}