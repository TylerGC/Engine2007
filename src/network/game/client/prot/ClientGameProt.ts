export default class ClientGameProt {
    static byId: ClientGameProt[] = [];

    static readonly NO_TIMEOUT = new ClientGameProt(19, 0); // NXT naming

    static readonly IDLE_TIMER = new ClientGameProt(226, 0);
    static readonly EVENT_MOUSE_CLICK = new ClientGameProt(63, 4); // NXT naming
    static readonly EVENT_MOUSE_MOVE = new ClientGameProt(111, -1); // NXT naming
    static readonly EVENT_APPLET_FOCUS = new ClientGameProt(130, 1); // NXT naming
    static readonly EVENT_CAMERA_POSITION = new ClientGameProt(173, 4); // NXT naming
    // static readonly EVENT_HAS_WINDOW = new ClientGameProt(9007, 4);
    // static readonly EVENT_SYNTH_ERROR = new ClientGameProt(9008, 2);

    static readonly OPOBJ1 = new ClientGameProt(216, 8); // NXT naming
    static readonly OPOBJ2 = new ClientGameProt(150, 8); // NXT naming
    static readonly OPOBJ3 = new ClientGameProt(205, 8); // NXT naming
    static readonly OPOBJ4 = new ClientGameProt(26, 8); // NXT naming
    static readonly OPOBJ5 = new ClientGameProt(32, 8); // NXT naming
    static readonly OPOBJE = new ClientGameProt(191, 2); // Naming from OS1 (Blame Pazaz)
    // static readonly OPOBJT = new ClientGameProt(131, 8); // NXT naming
    // static readonly OPOBJU = new ClientGameProt(9026, 12); // NXT naming

    static readonly OPNPC1 = new ClientGameProt(78, 2); // NXT naming
    static readonly OPNPC2 = new ClientGameProt(71, 2); // NXT naming
    static readonly OPNPC3 = new ClientGameProt(164, 2); // NXT naming
    static readonly OPNPC4 = new ClientGameProt(33, 2); // NXT naming
    static readonly OPNPC5 = new ClientGameProt(195, 2); // NXT naming
    static readonly OPNPCE = new ClientGameProt(127, 2); // Naming from OS1 (Blame Pazaz)
    // static readonly OPNPCT = new ClientGameProt(9032, 4); // NXT naming
    // static readonly OPNPCU = new ClientGameProt(9033, 8); // NXT naming

    static readonly OPLOC1 = new ClientGameProt(53, 6); // NXT naming
    static readonly OPLOC2 = new ClientGameProt(13, 6); // NXT naming
    static readonly OPLOC3 = new ClientGameProt(94, 6); // NXT naming
    static readonly OPLOC4 = new ClientGameProt(97, 6); // NXT naming
    static readonly OPLOC5 = new ClientGameProt(169, 6); // NXT naming
    static readonly OPLOC6 = new ClientGameProt(211, 6); // NXT naming
    static readonly OPLOCE = new ClientGameProt(166, 2); // Naming from OS1 (Blame Pazaz)
    // static readonly OPLOCT = new ClientGameProt(9039, 8); // NXT naming
    // static readonly OPLOCU = new ClientGameProt(9040, 12); // NXT naming

    static readonly OPPLAYER1 = new ClientGameProt(65, 2); // NXT naming
    static readonly OPPLAYER2 = new ClientGameProt(151, 2); // NXT naming
    static readonly OPPLAYER3 = new ClientGameProt(118, 2); // NXT naming
    static readonly OPPLAYER4 = new ClientGameProt(214, 2); // NXT naming
    static readonly OPPLAYER5 = new ClientGameProt(114, 2); // NXT naming
    static readonly OPPLAYER6 = new ClientGameProt(161, 2); // NXT naming
    static readonly OPPLAYER7 = new ClientGameProt(47, 2); // NXT naming
    static readonly OPPLAYER8 = new ClientGameProt(204, 2); // NXT naming
    // static readonly OPPLAYERT = new ClientGameProt(9046, 4); // NXT naming
    // static readonly OPPLAYERU = new ClientGameProt(9047, 8); // NXT naming

    // static readonly OPHELD1 = new ClientGameProt(9048, 6); // name based on runescript trigger
    // static readonly OPHELD2 = new ClientGameProt(9049, 6); // name based on runescript trigger
    // static readonly OPHELD3 = new ClientGameProt(9050, 6); // name based on runescript trigger
    // static readonly OPHELD4 = new ClientGameProt(9051, 6); // name based on runescript trigger
    // static readonly OPHELD5 = new ClientGameProt(9052, 6); // name based on runescript trigger
    // static readonly OPHELDT = new ClientGameProt(9053, 8); // name based on runescript trigger
    // static readonly OPHELDU = new ClientGameProt(9054, 12); // name based on runescript trigger

    static readonly IF_BUTTON1 = new ClientGameProt(44, 6); // NXT naming
    static readonly IF_BUTTON2 = new ClientGameProt(50, 6); // NXT naming
    static readonly IF_BUTTON3 = new ClientGameProt(103, 6); // NXT naming
    static readonly IF_BUTTON4 = new ClientGameProt(64, 6); // NXT naming
    static readonly IF_BUTTON5 = new ClientGameProt(178, 6); // NXT naming
    static readonly IF_BUTTON6 = new ClientGameProt(81, 6); // NXT naming
    static readonly IF_BUTTON7 = new ClientGameProt(236, 6); // NXT naming
    static readonly IF_BUTTON8 = new ClientGameProt(188, 6); // NXT naming
    static readonly IF_BUTTON9 = new ClientGameProt(128, 6); // NXT naming
    static readonly IF_BUTTON10 = new ClientGameProt(254, 6); // NXT naming

    static readonly IF_BUTTON = new ClientGameProt(109, 4); // NXT naming
    // static readonly RESUME_PAUSEBUTTON = new ClientGameProt(9061, 2); // NXT naming
    // static readonly CLOSE_MODAL = new ClientGameProt(184, 0); // NXT naming
    // static readonly RESUME_P_COUNTDIALOG = new ClientGameProt(23, 4); // NXT naming
    // static readonly TUTORIAL_CLICKSIDE = new ClientGameProt(9064, 1); // no original name
    // static readonly RESUME_P_NAMEDIALOG = new ClientGameProt(9065, 8); // NXT naming

    static readonly MAP_BUILD_COMPLETE = new ClientGameProt(213, 0); // NXT naming
    static readonly MOVE_OPCLICK = new ClientGameProt(159, -1); // (comes with OP packets, name based on other MOVE packets) // MOVE_SCRIPTED by 530?
    // static readonly REPORT_ABUSE = new ClientGameProt(99, 10); // NXT calls it 'BUG_REPORT' - unsure when it was named as such, might be more appropriate here.
    static readonly MOVE_MINIMAPCLICK = new ClientGameProt(199, -1); // NXT naming
    // static readonly IF_BUTTOND = new ClientGameProt(9070, 7); // NXT naming
    // static readonly IGNORELIST_DEL = new ClientGameProt(213, 8); // NXT naming
    // static readonly IGNORELIST_ADD = new ClientGameProt(34, 8); // NXT naming
    // static readonly IF_PLAYERDESIGN = new ClientGameProt(9073, 13);
    // static readonly CHAT_SETMODE = new ClientGameProt(9074, 3); // NXT naming
    // static readonly MESSAGE_PRIVATE = new ClientGameProt(201, -1); // NXT naming
    // static readonly FRIENDLIST_DEL = new ClientGameProt(57, 8); // NXT naming
    // static readonly FRIENDLIST_ADD = new ClientGameProt(120, 8); // NXT naming
    static readonly CLIENT_CHEAT = new ClientGameProt(175, -1); // NXT naming
    static readonly MESSAGE_PUBLIC = new ClientGameProt(189, -1); // NXT naming
    static readonly MOVE_GAMECLICK = new ClientGameProt(200, -1); // NXT naming

    static readonly CLAN_JOINCHAT_LEAVECHAT = new ClientGameProt(58, 8); // NXT naming
    // static readonly CLAN_KICKUSER = new ClientGameProt(162, 8); // NXT naming
    // static readonly FRIEND_SETRANK = new ClientGameProt(188, 9); // NXT naming

    static readonly WINDOW_STATUS = new ClientGameProt(198, 4); // NXT naming
    // static readonly DETECT_MODIFIED_CLIENT = new ClientGameProt(20, 4); // NXT naming
    // static readonly TRANSMITVAR_VERIFYID = new ClientGameProt(177, 2); // NXT naming
    // static readonly SOUND_SONGEND = new ClientGameProt(137, 4); // NXT naming

    constructor(
        readonly id: number,
        readonly length: number
    ) {
        ClientGameProt.byId[id] = this;
    }
}