#include <cstdio>
#include <cstdlib>

	int f() {
		int counter = 0;
		for (double x = 0; x < 1; x += 0.1)
			counter++;
		printf("%d\n", counter); // prints 11
	}



int main()
{
	f();
	return 0;
}
