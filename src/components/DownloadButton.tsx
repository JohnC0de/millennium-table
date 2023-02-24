import { Button } from "primereact/button"
import { Product } from "../types"

type Props = {
  products: Product[]
}

export default function DownloadButton({ products }: Props) {
  return (
    <Button
      onClick={() => {
        const csv = products
          .map(product => {
            return `${product.cod_produto};${product.fase};${product.data_previsto}`
          })
          .join("\n")

        if (!csv) return

        const BOM = "\uFEFF"
        const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.setAttribute("hidden", "")
        a.setAttribute("href", url)
        a.setAttribute("download", "produtos.csv")
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }}
      type="button"
      icon="pi pi-download"
      label="Salvar"
      tooltip="Baixa e salva os dados da tabela em um arquivo CSV."
      tooltipOptions={{ position: "left" }}
      text
    />
  )
}
