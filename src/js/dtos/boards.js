/**
 * Contains only dashboard page related data.
 */
export class BoardShortInfoDto {

    /**
     * @param {string} id
     * @param {string} name
     * @param {string} description
     * @param {string} wallpaperPreviewPath
     */
    constructor(id, name, description, wallpaperPreviewPath) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
        /** @readonly */
        this.wallpaperPreviewPath = wallpaperPreviewPath;
    }
}

export class BoardUserDto {

    /**
     *
     * @param {string} id
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} username
     * @param {string} email
     * @param {string} userPicture
     */
    constructor(id, firstName, lastName, username, email, userPicture) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.firstName = firstName;
        /** @readonly */
        this.lastName = lastName;
        /** @readonly */
        this.username = username;
        /** @readonly */
        this.email = email;
        /** @readonly */
        this.userPicture = userPicture;
    }

}


export class BoardDetailsDto {

    /**
     *
     * @param {string} id
     * @param {string} name
     * @param {string} description
     * @param {BoardUserDto} author
     * @param {BoardUserDto[]} participants
     * @param {string} created
     * @param {string} modified
     */
    constructor(id, name, description, author, participants, created, modified) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
        /** @readonly */
        this.author = author;
        /** @readonly */
        this.participants = participants;
        /** @readonly */
        this.created = created;
        /** @readonly */
        this.modified = modified;
    }

}

/**
 * Contains almost full information on specific board
 * (Comments are not included).
 */
export class BoardDto {

    /**
     * @param {string} id
     * @param {string} name
     * @param {string} description
     * @param {string} wallpaperPath
     * @param {ListDto[]} lists
     * @param {string} userId
     */
    constructor(id, name, description, wallpaperPath, lists, userId) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
        /** @readonly */
        this.wallpaperPath = wallpaperPath;
        /** @readonly */
        this.lists = lists;
        /** @readonly */
        this.userId = userId;
    }
}

export class CreateBoardDto {

    /**
     * @param {string} name
     * @param {string} description
     */
    constructor(name, description) {
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
    }
}

export class UpdateBoardDto {

    /**
     * @param {string} id
     * @param {string | null} name
     * @param {string | null} description
     * @param {boolean | null} isClosed
     */
    constructor(id, name, description, isClosed) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
        /** @readonly */
        this.isClosed = isClosed;
    }
}