import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";

import {
  TableChartRounded,
  AssignmentRounded,
  Edit,
  Delete,
  FileDownloadRounded,
} from "@mui/icons-material";

import { useForm, Controller } from "react-hook-form";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MaterialReactTable } from "material-react-table";

// ================= THEME =================
const THEME = {
  pageBg: "#F4F7FB",
  accent: "#4A90E2",
  gradient: "linear-gradient(135deg,#4A90E2 0%, #6FA8FF 100%)",
  tableHeader: "#4A5F7A",
  headerBorder: "#D6DFEA",
  cellBorder: "#E3E8F2",
  rowHover: "#EEF3FA",
};

// ================= HEADERS =================
const REQUIRED_HEADERS = [
  "sino",
  "projectDescription",
  "customerName",
  "lineltemWiseValue",
  "totalValue",
  "revisedValue",
  "remarks",
  "projectManager",
];

const ContractAssetsForm = () => {
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      sino: "",
      projectDescription: "",
      customerName: "",
      lineltemWiseValue: "",
      totalValue: "",
      revisedValue: "",
      remarks: "",
      projectManager: "",
    },
  });

  // ================= ADD ENTRY =================
  const onSubmit = (formData) => {
    setData((prev) => [...prev, formData]);
    reset();
    setSuccess(true);
  };

  // ================= EXPORT =================
  const exportToExcel = (rows) => {
    const formatted = rows.map((row) => ({
      "SI No": row.original.sino,
      "Project Description": row.original.projectDescription,
      Customer: row.original.customerName,
      "Line Value": row.original.lineltemWiseValue,
      "Total Value": row.original.totalValue,
      "Revised Value": row.original.revisedValue,
      Remarks: row.original.remarks,
      "Project Manager": row.original.projectManager,
    }));

    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ContractAssets");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Contract_Assets.xlsx");
  };

  // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      { header: "SI No", accessorKey: "sino" },
      { header: "Project Description", accessorKey: "projectDescription" },
      { header: "Customer", accessorKey: "customerName" },
      { header: "Line Value", accessorKey: "lineltemWiseValue" },
      { header: "Total Value", accessorKey: "totalValue" },
      { header: "Revised Value", accessorKey: "revisedValue" },
      { header: "Remarks", accessorKey: "remarks" },
      { header: "Project Manager", accessorKey: "projectManager" },
    ],
    []
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 3, backgroundColor: THEME.pageBg }}>
      {/* TABS */}
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        centered
        sx={{
          mb: 4,
          "& .Mui-selected": { color: THEME.accent },
          "& .MuiTabs-indicator": { backgroundColor: THEME.accent },
        }}
      >
        <Tab icon={<AssignmentRounded />} label="Data Entry" />
        <Tab icon={<TableChartRounded />} label="Records Dashboard" />
      </Tabs>

      {/* ================= FORM ================= */}
      {tabValue === 0 && (
        <Paper sx={{ p: 5, borderRadius: 4 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 800,
              background: THEME.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 4,
            }}
          >
            Contract Asset Entry
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {REQUIRED_HEADERS.map((key) => (
                <Grid item xs={12} md={6} key={key}>
                  <Controller
                    name={key}
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label={key} fullWidth />
                    )}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  px: 6,
                  borderRadius: 3,
                  background: THEME.gradient,
                  fontWeight: 700,
                }}
              >
                Submit Entry
              </Button>
            </Box>
          </form>
        </Paper>
      )}

      {/* ================= TABLE ================= */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <MaterialReactTable
            columns={columns}
            data={data}
            enableSorting
            enableColumnFilters
            enableHiding
            enableRowNumbers
            enableStickyHeader
            enableEditing
            editingMode="cell"
            onEditingCellSave={({ cell, row, value }) => {
              const updated = [...data];
              updated[row.index][cell.column.id] = value;
              setData(updated);
            }}
            enableRowActions
            renderRowActionMenuItems={({ row, closeMenu }) => [
              <MenuItem
                key="edit"
                onClick={() => {
                  row.toggleEditing();
                  closeMenu();
                }}
              >
                <Edit sx={{ mr: 1, color: THEME.accent }} />
                Edit
              </MenuItem>,
              <MenuItem
                key="delete"
                onClick={() => {
                  setData((prev) =>
                    prev.filter((_, i) => i !== row.index)
                  );
                  closeMenu();
                }}
              >
                <Delete sx={{ mr: 1, color: "red" }} />
                Delete
              </MenuItem>,
            ]}
            renderTopToolbarCustomActions={({ table }) => (
              <Button
                variant="contained"
                startIcon={<FileDownloadRounded />}
                onClick={() =>
                  exportToExcel(table.getRowModel().rows)
                }
                sx={{
                  background: THEME.gradient,
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Export Excel
              </Button>
            )}
            muiTableHeadCellFilterTextFieldProps={{
              sx: {
                "& .MuiInputBase-input::placeholder": {
                  color: THEME.accent,
                  opacity: 1,
                  fontWeight: 500,
                },
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: THEME.tableHeader,
                color: "#fff",
                fontWeight: 700,
                borderRight: `1px solid ${THEME.headerBorder}`,
                borderBottom: `2px solid ${THEME.headerBorder}`,
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                borderRight: `1px solid ${THEME.cellBorder}`,
                borderBottom: `1px solid ${THEME.cellBorder}`,
              },
            }}
            muiTableContainerProps={{
              sx: {
                border: `1px solid ${THEME.headerBorder}`,
                borderRadius: 2,
              },
            }}
          />
        </Paper>
      )}

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" variant="filled">
          Entry Added Successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContractAssetsForm;