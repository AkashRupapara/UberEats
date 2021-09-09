module.exports = (sequelize, Sequelize) => {
    const restaurant_details = sequelize.define("restaurant_details", {
        r_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        r_name: {
            type: Sequelize.STRING
        },
        r_city: {
            type: Sequelize.STRING
        },
        r_State: {
            type: Sequelize.STRING
        },
        r_desc: {
            type: Sequelize.STRING
        },
        r_contact_no: {
            type: Sequelize.BIGINT(11)
        },
        r_start: {
            type: Sequelize.DATE
        },
        r_end: {
            type: Sequelize.DATE
        }
    })
    return restaurant_details;
};
