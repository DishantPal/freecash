const wellcomeEmailSubject = (data) => {
    return `Wellcome ${data.username} to our platform`;
}

const wellcomeEmailContent = (data) => {
    const content = `<h1> Wellcome ${data.username} to our platform </h1>`;
    // const content = `# Wellcome ${data.username} to our platform`;
}

export const {
    subject: wellcomeEmailSubject,
    content: wellcomeEmailContent,
}