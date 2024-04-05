const wellcomeEmailSubject = (data) => {
    return `Your verification email link`;
}

const wellcomeEmailContent = (data) => {
    const content = `<h1> Hello ${data.username}; this is your veiffication link: <a href="${data.emailverifylink}">Link</a> </h1>`;
    // const content = `# Wellcome ${data.username} to our platform`;
}

export const {
    subject: wellcomeEmailSubject,
    content: wellcomeEmailContent,
}