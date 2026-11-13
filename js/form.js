
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("crackdentContactForm");
    if (!form) return;

    const status = document.getElementById("formStatus");
    const button = document.getElementById("submitEnquiry");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!form.reportValidity()) return;

        const formData = new FormData(form);

        // Spam protection
        if (formData.get("website")) return;

        formData.delete("website");

        status.textContent = "Sending your enquiry...";
        status.className = "form-status";

        button.disabled = true;
        button.textContent = "Sending...";

        try {
            const payload = Object.fromEntries(formData.entries());

            const response = await fetch(
                "https://formsubmit.co/ajax/Support@crackdent.com",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const result = await response.json();

            console.log("FormSubmit Response:", result);

            if (String(result.success).toLowerCase() !== "true") {
                throw new Error(
                    result.message || "Email service rejected the enquiry."
                );
            }

            form.reset();

            status.textContent =
                "Thank you! Your enquiry has been sent successfully.";

            status.className = "form-status success";

        } catch (error) {

            console.error("Enquiry Error:", error);

            status.textContent =
                error.message || "Something went wrong. Please try again.";

            status.className = "form-status error";

        } finally {

            button.disabled = false;
            button.textContent = "Submit Enquiry ↗";

        }
    });
});
