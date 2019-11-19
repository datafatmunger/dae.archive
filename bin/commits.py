import git
import sys

repo = git.Repo(sys.argv[1])
#commits = list(repo.iter_commits("master", max_count=5)))
commits = list(repo.iter_commits("master"))

def is_exists(filename, sha):
    """Check if a file in current commit exist."""
    files = repo.git.show("--pretty=", "--name-only", sha)
    if filename in files:
        return True

def get_file_commits(filename):
    file_commits = []
    for commit in commits:
        if is_exists(filename, commit.hexsha):
            # TODO: Check if filename is in created/changes ... if it is ... then do the line below otherwise, skip it - JBG
            file_commits.append(commit)

    return file_commits

file_commits = get_file_commits(sys.argv[2])

a = []
for commit in file_commits:
    a.append(commit.message.strip())

print(a)
