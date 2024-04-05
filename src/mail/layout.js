import {config} from '../../config'
import {settings} from '../../config'
import {icons} from '../../icons'

export const mailLayout = (content) => {
    return `<html>
        <head></head>
        <body>
            ${emailHeader()}

            ${content}

            ${emailFooter()}
        </body>
    </html>`
}

const emailHeader = () => {
    const headerHtml = `
        <header>
        ${settings('email.header')}
    </header>`
}

const socialLinks = () => {
    const socialLinks = settings('promote.links');

    const linksHtml = socialLinks.map(link => {
        return `<li><a href="${link.url}">${icons(link.platform)}</a></li>`
    })
}

const emailFooter = () => {
    const socialLinks = settings('promote.links');

    const linksHtml = socialLinks.map(link => {
        return ``
    })
}