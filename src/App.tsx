import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { ColumnGroup } from "primereact/columngroup"
import { Row } from "primereact/row"
import { Column } from "primereact/column"
import { Skeleton } from "primereact/skeleton"
import { useState } from "react"
import { Product } from "./types"
import DownloadButton from "./components/DownloadButton"
import RefreshQueryButton from "./components/DownloadButton copy"

const productExample: Product = {
  cod_produto: "Carregando...",
  descricao: null,
  fase: "Carregando...",
  data_previsto: "Carregando..."
}

const productsSkeletonArray = Array(10).fill(productExample)

const getProducts = async () => {
  const response = await axios.get<{ value: Product[] }>(
    "https://lli76r4rajt2eqe7zbris4v76m0dlizi.lambda-url.sa-east-1.on.aws/"
  )

  const phases: string[] = []
  const products = response.data.value.map(product => {
    if (product.fase.length > 0 && !phases.includes(product.fase)) {
      phases.push(product.fase)
    }

    const unformatedDate = product.data_previsto
      .replace("/Date(", "")
      .replace(")/", "")
    const date = new Date(parseInt(unformatedDate)).toLocaleDateString("pt-BR")
    return { ...product, data_previsto: date }
  })

  return { products, phases }
}

export default function App() {
  const queryProducts = useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  })

  if (queryProducts.isLoading) {
    return (
      <div className="flex flex-col h-screen flex-1  items-center">
        <div className="container h-screen">
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="100%" height="2rem" />
        </div>
      </div>
    )
  }

  if (queryProducts.isError) {
    return (
      <div className="flex flex-col h-screen flex-1  items-center">
        <div className="container h-screen">
          <div className="text-center">
            <h1>Erro ao carregar os produtos</h1>
            <Button
              label="Tentar novamente"
              onClick={() => queryProducts.refetch()}
            />
          </div>
        </div>
      </div>
    )
  }

  const header = (
    <div className="text-center table-header">
      <h5>Fases dos produtos</h5>
    </div>
  )

  return (
    <div className="flex flex-col h-screen flex-1  items-center">
      <div className="container h-screen">
        <DataTable
          key="id"
          value={queryProducts.data?.products ?? productsSkeletonArray}
          paginator
          rowsPerPageOptions={[10, 25, 50]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          paginatorLeft={<RefreshQueryButton query={queryProducts} />}
          paginatorRight={
            <DownloadButton products={queryProducts.data?.products} />
          }
          rows={10}
          header={header}
          size="small"
          stripedRows
          resizableColumns
          showGridlines
          emptyMessage="No customers products found."
          filterLocale="pt"
          filterDisplay="row"
          loading={queryProducts.isLoading}
        >
          <Column
            field="cod_produto"
            header="Produto"
            align="center"
            alignHeader={"center"}
            filter
            filterMatchMode="contains"
          />
          <Column
            align="center"
            field="fase"
            header="Fase Atual"
            filter
            headerClassName="text-center bg-red-500"
          />
          <Column
            align="center"
            field="data_previsto"
            header="Data prevista"
            filter
            filterType="date"
          />
        </DataTable>
      </div>
    </div>
  )
}
