export function getQuestionsData(response: any) {
	let questions = response?.data?.questions;
	if (Array.isArray(questions)) {
		const questionsList = questions.map((question: any) => {
			let _id = '';
			let title = '';
			let options = [] as string[];
			let answers = [] as string[];
			if ('_id' in question && typeof question?._id === 'string') {
				_id = question._id;
			}
			if (
				'questionText' in question &&
				typeof question?.questionText === 'string'
			) {
				title = question.questionText;
			}
			if ('options' in question && Array.isArray(question.options)) {
				if (
					question.options.length > 0 &&
					typeof question.options[0] === 'string'
				) {
					options = question.options;
				}
			}
			if ('answers' in question && Array.isArray(question.answers)) {
				if (
					question.answers.length > 0 &&
					typeof question.answers[0] === 'string'
				) {
					answers = question.answers;
				}
			}

			return {
				_id,
				title,
				options,
				answers,
			};
		});
		return questionsList;
	} else {
		return undefined;
	}
}
