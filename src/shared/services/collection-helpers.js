export async function insertAsync (data) {
    const collection = this;
    return new Promise((resolve, reject) => {
        collection.insert(data, (err, res) => {
            if (err)
                return reject(err);
            
            return resolve(res);
        });
    });
};

export async function updateAsync (finder, updater, options={}) {
    const collection = this;
    return new Promise((resolve, reject) => {
        collection.update(finder, updater, options, (err, res) => {
            if (err)
                return reject(err);
            
            return resolve(res);
        });
    });
};

export async function removeAsync (finder) {
    const collection = this;
    return new Promise((resolve, reject) => {
        collection.remove(finder, (err, res) => {
            if (err)
                return reject(err);
            
            return resolve(res);
        });
    });
};