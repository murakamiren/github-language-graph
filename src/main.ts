import "./style.css";

const languageElement = document.getElementById("languages");
const graphElement = document.getElementById("graph");

type formatDataType = {
	language: string;
	percent: number;
	color: string;
};

const repositoryApiUrl = "https://api.github.com/repos/robovm/apple-ios-samples/languages";
const githubColorUrl = "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json";
const otherColor = "#a3a3a3";

const getRepositoryLanguageData = async () => {
	const res = await fetch(repositoryApiUrl);
	const data = await res.json();

	return data;
};

const getGithubColor = async () => {
	const res = await fetch(githubColorUrl);
	const data = await res.json();

	return data;
};

const formatLanguageData = async () => {
	const repositoryLanguageData = await getRepositoryLanguageData();
	const githubColor = await getGithubColor();

	let languageTotalRate: number = 0;
	Object.keys(repositoryLanguageData).map((language) => {
		languageTotalRate += repositoryLanguageData[language];
	});

	const formatData: formatDataType[] = [];

	Object.keys(repositoryLanguageData).map((language) => {
		const percent = (repositoryLanguageData[language] / languageTotalRate) * 100;
		const color = githubColor[language].color;
		formatData.push({ language, percent, color });
	});

	return formatData;
};

const languageGraphData = async () => {
	const data = await formatLanguageData();

	let otherPercent: number = 0;
	const graphData = data.map((d, i) => {
		if (d.percent < 5) {
			otherPercent += d.percent;
		} else {
			return d;
		}

		if (i === data.length - 1) return { language: "other", percent: otherPercent, color: otherColor };
	});

	const newData = graphData.filter((d) => d !== undefined);

	return newData as formatDataType[];
};

const render = async () => {
	const data = await languageGraphData();

	data.map((d) => {
		if (graphElement) {
			graphElement.innerHTML += `<div class="graph-line" style="background-color: ${
				d.color
			}; width: ${d.percent.toFixed(1)}%; height: 16px;"></div>`;
		}

		if (languageElement) {
			languageElement.innerHTML += `<div class="language-comp">
			<div class="circle" style="background-color: ${d.color};"></div>
			<p>${d.language}: ${d.percent.toFixed(1)}%</p>
			</div>`;
		}
	});
};

await render();

console.log(await languageGraphData());
