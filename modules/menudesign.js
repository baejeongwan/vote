//#region Menubar
const { Menu } = require('electron')
function menuMaker(isDev) {
    let template = [
        {label: "파일", submenu: [
            /* Temporary blocked
            {
                label: "설정",
                click: function () {
                    require('./additionalWindowLoader').createSettingsWindow()
                }
            },*/
            {
                type: "separator"
            },
            {
            role: 'quit',
            label: "끝내기"
            }
        ]},
        {role: 'help', label: "도움", submenu: [
            {
                label: "사용설명서",
                click: function () {
                    require('./additionalWindowLoader').createHelpWindow()
                }
            },
            {
                label: "제대로 작동하지 않을때 연락해야 할 곳",
                click: function () {
                    require('electron').dialog.showMessageBoxSync(null, {title: "개발자 연락처", message: "이메일 jayden.bae@outlook.kr\n반,번호,이름: 7반 5번 배정완\n\n연락을 하실때 오작동 영상, 재현방법등을 함께 보내주시면 감사하겠습니다.", type: "info"})
                }
            },
            {
                label: "정보",
                click: function () {
                    require('electron').dialog.showMessageBoxSync(null, {message: "배정완이 (20705) 만든 투표 추첨 프로그램\n버전: " + require('electron').app.getVersion() + "\n\n사용해주셔서 감사합니다.\n\nAll Audio from Pixabay", title: "정보", type: 'info'})
                }
            }
        ]}
    ]
    if (isDev) {
        template[1].submenu.push({type: "separator"})
        template[1].submenu.push({label: "디버거 열기", role: "toggleDevTools"})
        return Menu.buildFromTemplate(template)
    } else {
        return Menu.buildFromTemplate(template)
    }
}
//#endregion

module.exports = {menuMaker}