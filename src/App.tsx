import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import DownloadButton from "./components/DownloadButton"
import RefreshQueryButton from "./components/RefreshQueryButton"
import { Toast } from "primereact/toast"
import { Product } from "./types"
import { useRef } from "react"

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

  const toast = useRef(null)

  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Message Content",
      life: 3000
    })
  }

  if (queryProducts.isLoading) {
    return (
      <div className="flex flex-col h-screen flex-1  items-center">
        <div className="container flex justify-center items-center">
          <h1>Please wait while we load the products...</h1>
        </div>
      </div>
    )
  }

  if (queryProducts.isError) {
    showError()
    return (
      <div className="flex flex-col h-screen flex-1  items-center">
        <div className="container flex flex-col min-h-screen flex-1">
          <div className="text-center">
            <h1>Erro ao carregar os produtos</h1>
            <Toast ref={toast} />
            <Button
              label="Tentar novamente"
              onClick={() => {
                queryProducts.refetch()
              }}
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
    <div className="flex flex-col min-h-screen bg-slate-100 flex-1 backsvg items-center">
      <div className="container">
        <DataTable
          className="my-8"
          key="id"
          value={queryProducts.data?.products}
          paginator
          rowsPerPageOptions={[15, 25, 50]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          paginatorLeft={<RefreshQueryButton query={queryProducts} />}
          paginatorRight={
            <DownloadButton products={queryProducts.data?.products} />
          }
          rows={15}
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
            filterPlaceholder="Pesquisar por nome"
            sortable
          />
          <Column
            align="center"
            field="fase"
            header="Fase Atual"
            filter
            filterPlaceholder="Pesquisar por fase"
            headerClassName="text-center bg-red-500"
            sortable
          />
          <Column
            align="center"
            field="data_previsto"
            header="Data prevista"
            filter
            filterType="date"
            sortable
            body={isExpired =>
              isExpired.data_previsto <
              new Date().toLocaleDateString("pt-BR") ? (
                <span className="font-semibold bg-red-300/50 rounded-2xl p-1 text-red-600">
                  {isExpired.data_previsto}
                </span>
              ) : (
                <span>{isExpired.data_previsto}</span>
              )
            }
          />
        </DataTable>
      </div>
    </div>
  )
}
