// Soft UI Dashboard React examples
import { Card, Checkbox } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import Table from "examples/Tables/Table";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import sentTableData from "./sentTableData";
import { useSoftUIController } from "context";
import { useEffect, useState } from "react";
import { Button } from "reactstrap";

function Sent() {
  const [controller, dispatch] = useSoftUIController();
  const [columns2, setColumns2] = useState([
    {name: "AMOUNT", align: "left"},
    {name: "DESCRIPTION", align: "left"},
    { name: "RECEPTIANT", align: "left" },
    { name: "ID", align: "left" },
    { name: "DATE", align: "left" },
    { name: "STATE", align: "center" },
    { name: "action", align: "center" },
  ]);
  const [rows2, setRows2] = useState([]);
  const [totalItems, setTotalItems] = useState(controller.user.transactions.length);
  const [transactions, setTransactions] = useState(controller.user.transactions);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  function AmountField({ amount }) {
    return (
      <SoftBox px={1}>
        <Checkbox />
        <SoftTypography pl={1} variant="button" fontWeight="medium">
          {amount}
        </SoftTypography>
      </SoftBox>
    );
  }

  useEffect(() => {
    async function x() {
      const paginatedTransactions = paginate(currentPage);
      const rows = await paginatedTransactions.map((transaction) => {
        if(transaction.action === "transfer" && transaction.amount < 0) {
          console.log("XXX")
          return {
            AMOUNT: <AmountField amount={transaction.currency + " " +  parseInt(transaction.amount.toFixed(2))} />,
            DESCRIPTION: (
              <SoftTypography variant="caption" color="secondary" fontWeight="medium">
                {transaction.action}
              </SoftTypography>
            ),
            RECEPTIANT: (
              <SoftTypography variant="caption" color="secondary" fontWeight="medium">
                {transaction.userInteraction}
              </SoftTypography>
            ),
            ID: (
              <SoftTypography variant="caption" color="secondary" fontWeight="medium">
                {transaction.id}
              </SoftTypography>
            ),
            DATE: (
              <SoftTypography variant="caption" color="secondary" fontWeight="medium">
                {transaction.date}
              </SoftTypography>
            ),
            STATE: (
              <SoftTypography variant="caption" color={transaction.status === "success" || transaction.status === "succeeded" ? "success" : "error" } fontWeight="medium">
                {transaction.status}
              </SoftTypography>
            )
          }
        }
      }).filter((item) => item !== undefined)
      await setRows2(rows);
      console.log(rows2)
    }
    x();
  },[controller, currentPage])

  function paginate(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return transactions.slice(startIndex, endIndex);
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }
  
  function goToNextPage() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }

  function Actions() {
    return (
      <SoftBox display="flex" gap={2}>
        <SoftBox onClick={() => {}}>
          <Visibility />
        </SoftBox>
      </SoftBox>
    );
  }

  return (
    <DashboardLayout>
      <SoftBox mb={3}>
        <Card>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <SoftTypography variant="h6">All Transfers</SoftTypography>
              <SoftBox display="flex" >
                <Button variant="contained" color="primary" onClick={goToPreviousPage}>
                  Previus Page
                </Button>
                <SoftTypography mr={2} ml={2} variant="h6"> {currentPage} </SoftTypography>
                <Button variant="contained" color="secondary" onClick={goToNextPage}>
                  Next Page
                </Button>
              </SoftBox>
          </SoftBox>
          <SoftBox
            sx={{
              "& .MuiTableRow-root:not(:last-child)": {
                "& td": {
                  borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                },
              },
            }}
          >
            <Table
              columns={columns2}
              rows={rows2.map((item) => ({ ...item, action: <Actions /> }))}
            />
          </SoftBox>
        </Card>
      </SoftBox>
    </DashboardLayout>
  );
}

export default Sent;
