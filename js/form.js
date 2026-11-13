
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("crackdentContactForm");
    if (!form) return;

    const status = document.getElementById("formStatus");
    const button = document.getElementById("submitEnquiry");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!form.reportValidity()) return;

        status.textContent = "Sending your enquiry...";
        status.className = "form-status";

        button.disabled = true;
        button.textContent = "Sending...";

        const formData = new FormData(form);

        // Spam protection
        if (formData.get("website")) {
            status.textContent = "Thank you!";
            return;
        }

        formData.delete("website");
        formData.delete("consent");

        try {
            const response = await fetch(
                "https://formsubmit.co/ajax/Support@crackdent.com",
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json"
                    },
                    body: formData
                }
            );

            const result = await response.json();

            if (!response.ok || result.success !== "true") {
                throw new Error("We could not send your enquiry. Please try again.");
            }

            form.reset();

            status.textContent =
                "Thank you! Your enquiry has been sent successfully. Our team will contact you.";

            status.className = "form-status success";

        } catch (error) {
            status.textContent =
                error.message || "Something went wrong. Please email Support@crackdent.com directly.";

            status.className = "form-status error";

        } finally {
            button.disabled = false;
            button.textContent = "Submit Enquiry ↗";
        }
    });
});
