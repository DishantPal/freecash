const bonusUpdatedSubject = (data) => {
    return `Your bonus for ${data.bonusname} is ${data.status}`;
}

// const wellcomeEmailContent = (data) => {
//     const bonusStatusLabel = {
//         confirm: 'Confirmd',
//         declined: 'Declined',
//     }

//     const content = `<h1> Hello ${data.user.name}, congrats!. Your bonus is ${bonusStatusLabel[data.status]} </h1>`;
//     // const content = `# Wellcome ${data.username} to our platform`;
// }

const confimedBonusMailContent = () => {
    
}

const declinedBonusMailContent = () => {

}

const bonusMailUdpatedCOntent = (data) => {
    switch(data) {
        case 'confirmed': return confimedBonusMailContent(data);
        case 'declined': return declinedBonusMailContent(data);
    }

}

export const {
    subject: bonusUpdatedSubject,
    content: bonusMailUdpatedCOntent,
}