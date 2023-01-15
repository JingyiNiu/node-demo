const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;

mongoose.set("strictQuery", false);
mongoose
    .connect("mongodb://127.0.0.1:27017/mongo-exercises")
    .then(() => {
        console.log("connected to mongoDB...");
    })
    .catch((error) => console.log("can not connect to mongoDB...", error));

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 255,
        // match: /pattern/,
    },
    category: { type: String, required: true, enum: ["web", "mobile", "network"] },
    author: String,
    tags: {
        type: Array,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "A course should have at least one tag",
        },
    },
    date: Date,
    isPublished: Boolean,
    price: {
        type: Number,
        min: 0,
        max: 9999,
        required: function () {
            return this.isPublished; // price is required when isPublish is set to true
        },
    },
});

const Course = mongoose.model("Course", courseSchema);

const createCourse = async () => {
    const course = new Course({
        name: "React",
        author: "Mary2",
        category: "web",
        // tags: ["react", "frontend"],
        tags: null,
        isPublished: true,
        price: 20,
    });

    try {
        const res = await course.save();
        console.log(res);
    } catch (error) {
        console.log(error.message);
    }
};
createCourse();

const getCourses = async () => {
    // Comparison operator
    // eq (equal)
    // ne (not equal)
    // gt (greated than)
    // gte (greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in
    // nin (not in)

    // Logical operator
    // or
    //and

    // Regular expressions
    // /^something/ (starts with 'something')
    // /something$/i (ends with 'something', 'i' means case insensative)
    // /.*Mosh.*/i (contain 'something', '.*' means can have 0 or multiple characters)

    const pageNumber = 1;
    const pageSize = 10;

    const courses = await Course
        // .find({ price: { $gte: 10, $lte: 20 } })  // Comparison operator
        // .find({ price: { $in: [10, 15, 20] } })  // Comparison operator
        // .or([{ author: "John" }, { isPublished: true }]) // Logical operator
        // .and([{ author: "John" }, { isPublished: true }]) // Logical operator
        .find({ author: /.*John.*/i })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ name: -1 })
        // .count();
        .select({ name: 1, tags: 1 });
    console.log(courses);
};
// getCourses();

const getCourse = async () => {
    const course = await Course.find({ name: "Node.js" })
        .limit(10)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1 });
    console.log(course);
};
// getCourse();

const updateCourse = async (id) => {
    // Query first
    // const course = await Course.findById(id);
    // if (!course) {
    //     console.log("No course found");
    //     return;
    // }
    // course.set({
    //     isPublished: true,
    //     author: "Another author",
    // });
    // const res = await course.save();
    // console.log(res);

    // Update first
    // https://www.mongodb.com/docs/manual/reference/operator/update/
    const res = await Course.findByIdAndUpdate(
        { _id: id },
        {
            $set: {
                author: "John",
                isPublished: false,
            },
        }
    );
    console.log(res);
};
// updateCourse("63c0a0085d55c6279db3c5f0");

const deleteCourse = async (id) => {
    // const res = await Course.deleteOne({_id: id});
    const res = await Course.findByIdAndRemove(id);
    // const res = await Course.deleteMany({author: "Mary2"});

    console.log(res);
};
// deleteCourse("63c0a4807fde45c08079bd5f");

const getCoursesExercisesOne = async () => {
    return (
        Course.find({ isPublished: true, tags: "backend" })
            // .find()
            // .and([{ isPublished: true }, { tags: "backend" }])
            .sort({ name: 1 })
            .select({ isPublished: 1, tags: 1 })
    );
};

const getCoursesExercisesTwo = async () => {
    return (
        Course.find({ isPublished: true }, { tags: { $in: ["frontend", "backend"] } })
            // .find({ isPublished: true })
            // .or([{ tags: "frontend" }, { tags: "backend" }])
            .sort({ price: -1 })
            .select({ name: 1, tags: 1, price: 1 })
    );
};

const getCoursesExercisesThree = async () => {
    return Course.find({ isPublished: true }).or([{ name: /.*by.*/i }, { price: { $gte: 15 } }]);
};

const getCoursesExercisesFour = async () => {
    return Course.find({ price: { $gte: 15 } });
};

const getData = async () => {
    const data = await getCoursesExercisesFour();
    console.log(data);
};

// getData();
