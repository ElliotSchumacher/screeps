var helper = {

    prioritizeRoles: function(roles) {
        let sortedRoles = Object.keys(roles).sort(function(role1, role2) {
            return roles[role1].priority - roles[role2].priority;
        });
        console.log(sortedRoles);
        return sortedRoles;
    }
};

module.exports = helper;