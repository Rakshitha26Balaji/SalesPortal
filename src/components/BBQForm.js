import React, { useState } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Zoom,
  Chip,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useForm, Controller } from "react-hook-form";

export default function TrialBeautifulForm() {
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      location: "",
      notes: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    // ✅ Dummy API delay to simulate backend call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Submitted Data:", data);

    setLoading(false);
    setSubmitSuccess(true);
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.18), transparent 40%), radial-gradient(circle at 80% 30%, rgba(34,197,94,0.14), transparent 45%), linear-gradient(135deg, #EAF6FD 0%, #CFE9F7 40%, #B6DFF5 100%)",
        py: 5,
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Chip
            label="Trial Create Data Section"
            sx={{
              px: 2,
              py: 2,
              fontWeight: 800,
              fontSize: 13,
              borderRadius: 999,
              background: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(37,99,235,0.15)",
              backdropFilter: "blur(12px)",
            }}
          />
          <Typography
            variant="h3"
            sx={{
              mt: 2,
              fontWeight: 950,
              letterSpacing: 0.2,
              background: "linear-gradient(90deg,#0ea5e9,#2563eb,#16a34a)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Beautiful Form UI (Demo)
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "rgba(15,23,42,0.7)",
              fontWeight: 600,
            }}
          >
            After submit, the form disappears and a success screen appears.
          </Typography>
        </Box>

        {/* Success Screen */}
        {submitSuccess ? (
          <Zoom in={submitSuccess}>
            <Box sx={{ mt: 4 }}>
              <Card
                sx={{
                  borderRadius: 6,
                  p: { xs: 3, md: 5 },
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(235,248,255,0.92))",
                  backdropFilter: "blur(14px)",
                  boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                  border: "1px solid rgba(59,130,246,0.18)",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 95,
                    height: 95,
                    mx: "auto",
                    mb: 2,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background:
                      "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(59,130,246,0.14))",
                  }}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 62, color: "#16a34a" }} />
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 950,
                    letterSpacing: 0.2,
                    background: "linear-gradient(90deg,#16a34a,#2563eb)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Form Submitted Successfully!
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 15.5,
                    color: "rgba(15,23,42,0.75)",
                    fontWeight: 600,
                  }}
                >
                  Your details have been recorded. You can submit another form now.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    size="large"
                    variant="contained"
                    startIcon={<RestartAltRoundedIcon />}
                    onClick={() => setSubmitSuccess(false)}
                    sx={{
                      px: 5,
                      py: 1.4,
                      borderRadius: 999,
                      fontWeight: 900,
                      textTransform: "none",
                      background: "linear-gradient(90deg,#2563eb,#38bdf8)",
                      boxShadow: "0 12px 30px rgba(37,99,235,0.35)",
                      "&:hover": {
                        background: "linear-gradient(90deg,#1d4ed8,#0ea5e9)",
                      },
                    }}
                  >
                    Submit Another Form
                  </Button>

                  <Button
                    size="large"
                    variant="outlined"
                    sx={{
                      px: 5,
                      py: 1.4,
                      borderRadius: 999,
                      fontWeight: 900,
                      textTransform: "none",
                    }}
                    onClick={() => alert("Dummy: Navigate to View Data Tab")}
                  >
                    View Data
                  </Button>
                </Box>
              </Card>
            </Box>
          </Zoom>
        ) : (
          // Form
          <Card
            sx={{
              borderRadius: 6,
              p: { xs: 3, md: 4 },
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 25px 70px rgba(2,132,199,0.18)",
              border: "1px solid rgba(2,132,199,0.14)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow effect */}
            <Box
              sx={{
                position: "absolute",
                top: -120,
                right: -120,
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: "rgba(56,189,248,0.25)",
                filter: "blur(40px)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -120,
                left: -120,
                width: 280,
                height: 280,
                borderRadius: "50%",
                background: "rgba(34,197,94,0.16)",
                filter: "blur(45px)",
              }}
            />

            <Box sx={{ position: "relative" }}>
              <Typography variant="h5" sx={{ fontWeight: 950 }}>
                Create Data
              </Typography>
              <Typography
                sx={{
                  mt: 0.6,
                  color: "rgba(15,23,42,0.72)",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Dummy form (frontend-only). Submit to see success UI.
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2.3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="fullName"
                      control={control}
                      rules={{ required: "Full Name is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Full Name"
                          error={!!errors.fullName}
                          helperText={errors.fullName?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter valid email",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="phone"
                      control={control}
                      rules={{
                        required: "Phone is required",
                        minLength: { value: 10, message: "Minimum 10 digits" },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone"
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="company"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} fullWidth label="Company" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} fullWidth label="Location" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="notes"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          minRows={3}
                          label="Notes"
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* Buttons */}
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    disabled={loading}
                    startIcon={
                      loading ? <CircularProgress size={20} color="inherit" /> : <SendRoundedIcon />
                    }
                    sx={{
                      px: 6,
                      py: 1.4,
                      borderRadius: 999,
                      fontWeight: 900,
                      textTransform: "none",
                      background: "linear-gradient(90deg,#2563eb,#38bdf8)",
                      boxShadow: "0 12px 30px rgba(37,99,235,0.35)",
                      "&:hover": {
                        background: "linear-gradient(90deg,#1d4ed8,#0ea5e9)",
                      },
                    }}
                  >
                    {loading ? "Submitting..." : "Submit Form"}
                  </Button>

                  <Button
                    type="button"
                    size="large"
                    variant="outlined"
                    disabled={loading}
                    onClick={() => reset()}
                    sx={{
                      px: 6,
                      py: 1.4,
                      borderRadius: 999,
                      fontWeight: 900,
                      textTransform: "none",
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
            </Box>
          </Card>
        )}
      </Container>
    </Box>
  );
}
