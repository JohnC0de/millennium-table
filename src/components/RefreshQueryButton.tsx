import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { useRef } from "react"

type Props = {
  query: any
}

export default function RefreshQueryButton({ query }: Props) {
  const toast = useRef(null)

  const showInfo = () => {
    toast.current.show({
      severity: "info",
      summary: "Atualizando...",
      detail: "Aguarde, os dados da tabela estão sendo atualizados.",
      life: 2000
    })
  }

  return (
    <div>
      <Toast ref={toast} />
      <Button
        onClick={() => {
          query.refetch()
          showInfo()
        }}
        type="button"
        icon="pi pi-refresh"
        label="Atualizar"
        tooltip="Atualiza os dados da tabela."
        text
      />
    </div>
  )
}
